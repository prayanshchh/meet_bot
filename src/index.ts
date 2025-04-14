import { Builder, Browser, By, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'

async function openMeet(driver: WebDriver) {
  
  try {
    await driver.get('https://meet.google.com/tuq-dhia-hhs');
    ​​const popupButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Got it")]')), 10000);
    await popupButton.click()
    ​​const nameInput = await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Your name"]')), 10000);
    await nameInput.clear();
    await nameInput.click();
    await nameInput.sendKeys('value', "Meeting bot");
    await driver.sleep(1000)
    ​​const buttonInput = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')), 10000);
    buttonInput.click();    
  } finally {

  }
}

async function getDriver() {
    const options = new Options({})
    options.excludeSwitches('enable-automation');
    options.addArguments(
        '--disable-blink-features=AutomationControlled',
        '--use-fake-ui-for-media-stream',
        '--enable-usermedia-screen-capturing',
        '--auto-select-desktop-capture-source=[RECORD]',
        '--auto-select-tab-capture-source-by-title=Meet',
        '--window-size=1080,720',
        '--allow-running-insecure-content',
        '--disable-notifications',
        '--disable-popup-blocking',
        '--start-maximized',
        '--incognito',
        '--test-type',
        '--disable-extensions',
        '--disable-infobars'
      );

    // ​​--allow-file-access-from-files--use-fake-device-for-media-stream--allow-running-insecure-content--allow-file-access-from-files--use-fake-device-for-media-stream--allow-running-insecure-content


    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    return driver;
}

async function startScreenshare(driver: WebDriver) {
    console.log("startScreensharecalled")
    const response = await driver.executeScript(`

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
            
            let recorded = wait(10000).then(() => {
                if (recorder.state === "recording") {
                recorder.stop();
                }
            });
            
            return Promise.all([stopped, recorded]).then(() => data);
        }
      
        console.log("before mediadevices")
        window.navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: "browser"
            },
            audio: true,
            preferCurrentTab: true
        }).then(async screenStream => {                        
            const audioContext = new AudioContext();
            const screenAudioStream = audioContext.createMediaStreamSource(screenStream)
            const dest = audioContext.createMediaStreamDestination();
            window.setInterval(() => {
              document.querySelectorAll("audio").forEach(audioEl => {
                if (!audioEl.getAttribute("added")) {
                  console.log("adding new audio");
                  const audioEl = document.querySelector("audio");
                  const audioElStream = audioContext.createMediaStreamSource(audioEl.srcObject)
                  audioEl.setAttribute("added", true);
                  audioElStream.connect(dest)
                  console.log("added new audio");
                }
              })

            }, 1000);
    
          // Combine screen and audio streams
          const combinedStream = new MediaStream([
              ...screenStream.getVideoTracks(),
              ...dest.stream.getAudioTracks()
          ]);
          
          console.log("before start recording")
          const recordedChunks = await startRecording(combinedStream, 60000);
          console.log("after start recording")
          
          let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
          
          // Create download for video with audio
          const recording = document.createElement("video");
          recording.src = URL.createObjectURL(recordedBlob);
          
          const downloadButton = document.createElement("a");
          downloadButton.href = recording.src;
          downloadButton.download = "RecordedScreenWithAudio.webm";    
          downloadButton.click();
          
          console.log("after download button click")
          
          // Clean up streams
          screenStream.getTracks().forEach(track => track.stop());
          audioStream.getTracks().forEach(track => track.stop());
        })
        
    `)
    console.log(response)
    driver.sleep(1000000)
}

async function main() {
    const driver = await getDriver();
    await openMeet(driver);
    await new Promise(x => setTimeout(x, 20000));
    await startScreenshare(driver);    
}
main();