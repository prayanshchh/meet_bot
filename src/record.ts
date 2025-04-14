// src/record.ts
import { WebDriver } from 'selenium-webdriver';

export async function startScreenshare(driver: WebDriver) {
  await driver.executeScript(`
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    window.chrome = { runtime: {} };

    function wait(delayInMS) {
      return new Promise((resolve) => setTimeout(resolve, delayInMS));
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

      let recorded = wait(60000).then(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      });

      return Promise.all([stopped, recorded]).then(() => data);
    }

    window.navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: true,
      preferCurrentTab: true
    }).then(async screenStream => {
      const audioContext = new AudioContext();
      const screenAudioStream = audioContext.createMediaStreamSource(screenStream);
      const dest = audioContext.createMediaStreamDestination();

      window.setInterval(() => {
        document.querySelectorAll("audio").forEach(audioEl => {
          if (!audioEl.getAttribute("added")) {
            const audioElStream = audioContext.createMediaStreamSource(audioEl.srcObject);
            audioEl.setAttribute("added", "true");
            audioElStream.connect(dest);
          }
        });
      }, 1000);

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ]);

      const recordedChunks = await startRecording(combinedStream);
      let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });

      const recording = document.createElement("video");
      recording.src = URL.createObjectURL(recordedBlob);

      const downloadButton = document.createElement("a");
      downloadButton.href = recording.src;
      downloadButton.download = "RecordedScreenWithAudio.webm";
      downloadButton.click();

      screenStream.getTracks().forEach(track => track.stop());
      dest.stream.getTracks().forEach(track => track.stop());
    });
  `);
}