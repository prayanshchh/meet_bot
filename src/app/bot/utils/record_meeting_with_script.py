from playwright.async_api import Page, BrowserContext
import os

async def record_meeting_with_script(page: Page, context: BrowserContext, download_dir: str) -> str:
    async with page.expect_download(timeout=86400000) as download_info:
        await page.evaluate("""
        (async () => {
            function waitForText(text) {
                return new Promise((resolve) => {
                    if (document.body.innerText.includes(text)) {
                        resolve();
                        return;
                    }
                    const observer = new MutationObserver(() => {
                        if (document.body.innerText.includes(text)) {
                            observer.disconnect();
                            resolve();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
                });
            }

            function startRecording(stream) {
                let recorder = new MediaRecorder(stream);
                let data = [];
                recorder.ondataavailable = (event) => data.push(event.data);
                recorder.start();

                let stopped = new Promise((resolve, reject) => {
                    recorder.onstop = resolve;
                    recorder.onerror = (event) => reject(event.name);
                });

                return {
                    stop: () => {
                        if (recorder.state === "recording") recorder.stop();
                    },
                    dataPromise: stopped.then(() => data)
                };
            }

            const screenStream = await window.navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: "browser" },
                audio: true,
                preferCurrentTab: true
            });

            const audioContext = new AudioContext();
            const screenAudioStream = audioContext.createMediaStreamSource(screenStream);
            const audioEls = document.querySelectorAll("audio");
            const dest = audioContext.createMediaStreamDestination();

            screenAudioStream.connect(dest);
            audioEls.forEach(audioEl => {
                if (audioEl.srcObject) {
                    const audioElStream = audioContext.createMediaStreamSource(audioEl.srcObject);
                    audioElStream.connect(dest);
                }
            });

            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...dest.stream.getAudioTracks()
            ]);

            const recorder = startRecording(combinedStream);

            await waitForText("Return to home screen");

            recorder.stop();

            const recordedChunks = await recorder.dataPromise;
            let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });

            const recording = document.createElement("video");
            recording.src = URL.createObjectURL(recordedBlob);

            const downloadButton = document.createElement("a");
            downloadButton.href = recording.src;
            downloadButton.download = "RecordedScreenWithAudio.webm";
            downloadButton.click();

            screenStream.getTracks().forEach(track => track.stop());
            dest.stream.getTracks().forEach(track => track.stop());
        })();
        """)
    download = await download_info.value
    video_path = os.path.join(download_dir, download.suggested_filename)
    await download.save_as(video_path)
    return video_path 