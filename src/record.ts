// src/record.ts
import { WebDriver, until, By, Key } from 'selenium-webdriver';


export async function startScreenshare(driver: WebDriver) {
  const message = `Hello everyone!
I’m MeetBot, your AI-powered assistant for this session. I’ll be silently recording the meeting and capturing key points to generate accurate notes and summaries for everyone afterward. My goal is to help you stay focused and reduce the need for manual note-taking.
  
If you have any action items, important topics, or questions you'd like emphasized, feel free to mention them in the chat. I’ll do my best to highlight those in the final summary. Wishing you a productive meeting`;

  const chatButton = await driver.wait(
    until.elementLocated(By.xpath('//button[@aria-label="Chat with everyone"]')),
    90000
  );
  await chatButton.click();
  const input = await driver.wait(
    until.elementLocated(By.xpath('//textarea[@aria-label="Send a message" or @placeholder="Send a message"]')),
    10000
  );
  await input.sendKeys(message, Key.RETURN).then(async () => {
    await chatButton.click().then(async () => {
      await driver.executeScript(`
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
    
        let observer = new MutationObserver((mutationsList, observer) => {
          const endl = document.querySelector('h1[jsname="r4nke"]');
          if (endl && endl.textContent.includes("Your host ended the meeting for everyone")) {
            if (recorder.state === "recording") recorder.stop();
            observer.disconnect();
          }
        });
    
          observer.observe(document.body, { childList: true, subtree: true });
    
          return Promise.all([stopped]).then(() => data);
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

          const combinedAudioTracks = dest.stream.getAudioTracks();
          const audioOnlyStream = new MediaStream(combinedAudioTracks);
        
            const [videoChunks, audioChunks] = await Promise.all([
             startRecording(fullStream),
             startRecording(audioOnlyStream, 'audio/webm')
            ]);
          let recordedBlob = new Blob(videoChunks, { type: "video/webm" });
          let audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    
          const recording = document.createElement("video");
          const audioRecording = document.createElement("audio");
          recording.src = URL.createObjectURL(recordedBlob);
          audioRecording.src = URL.createObjectURL(audioBlob);
    
          const downloadButton = document.createElement("a");
          downloadButton.href = recording.src;
          downloadButton.download = "RecordedScreenWithAudio.webm";
          downloadButton.click();
          
    
          screenStream.getTracks().forEach(track => track.stop());
          dest.stream.getTracks().forEach(track => track.stop());
        });
      `);
    });
  });
}