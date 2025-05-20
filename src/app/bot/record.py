from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementNotInteractableException, TimeoutException, NoSuchElementException, InvalidSessionIdException
from threading import Thread

from utilities.minio.generatePresignedURL import generate_upload_url
from db.database import SessionLocal
from db.models import Recording
import uuid
from datetime import datetime
import time

def watch_and_click_got_it(driver):
    while True:
        try:
            button = driver.find_element(By.XPATH, '//button[.//span[text()="Got it"]]')
            if button.is_displayed():
                button.click()
                print("'Got it' button clicked.")
                return
        except (NoSuchElementException, InvalidSessionIdException):
            pass
        except ElementNotInteractableException:
            pass
        time.sleep(2)

def watch_input_box(driver):
    while True:
        try:
            input_box = driver.find_element(By.XPATH, '//span[contains(@jsname, "S5tZuc")]//svg')
            if input_box.is_displayed():
                input_box.click()
                print("'input_box' button clicked.")
                return
        except (NoSuchElementException, InvalidSessionIdException):
            pass
        except ElementNotInteractableException:
            pass
        time.sleep(2)



def start_screenshare(driver, meet_id):
    Thread(target=watch_and_click_got_it, args=(driver,), daemon=True).start()
    Thread(target=watch_input_box, args=(driver,), daemon=True).start()

    file_name = f"meeting-{int(time.time())}.webm"
    put_signed_url = generate_upload_url(file_name)
    meesage = """Hello everyone!
    I’m MeetBot, your AI-powered assistant for this session. I’ll be silently recording the meeting and capturing key points to generate accurate notes and summaries for everyone afterward. My goal is to help you stay focused and reduce the need for manual note-taking.

    If you have any action items, important topics, or questions you'd like emphasized, feel free to mention them in the chat. I’ll do my best to highlight those in the final summary. Wishing you a productive meeting."""
    
    wait = WebDriverWait(driver, 90)
    chat_button = wait.until(EC.presence_of_element_located((By.XPATH, '//button[@aria-label="Chat with everyone"]')))
    chat_button.click()

    input_box = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//textarea[@aria-label="Send a message" or @placeholder="Send a message"]')))
    input_box.send_keys(meesage + Keys.RETURN)
    chat_button.click()

    print("executing script")

    driver.execute_script(f"""
    function startRecording(stream) {{
      let recorder = new MediaRecorder(stream);
      let data = [];

      recorder.ondataavailable = (event) => data.push(event.data);
      recorder.start();

      let stopped = new Promise((resolve, reject) => {{
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
      }});

      let observer = new MutationObserver(() => {{
        const endl = document.querySelector('h1[jsname="r4nke"]');
        console.log("I am here", endl.textContent)
        if (endl && endl.textContent.includes("Your host ended the meeting for everyone")) {{
          if (recorder.state === "recording") recorder.stop();
          observer.disconnect();
        }}
      }});

      observer.observe(document.body, {{ childList: true, subtree: true }});

      return Promise.all([stopped]).then(() => data);
    }}

    window.navigator.mediaDevices.getDisplayMedia({{
      video: {{ displaySurface: "browser" }},
      audio: true,
      preferCurrentTab: true
    }}).then(async screenStream => {{
      const audioContext = new AudioContext();
      const dest = audioContext.createMediaStreamDestination();

      window.setInterval(() => {{
        document.querySelectorAll("audio").forEach(audioEl => {{
          if (!audioEl.getAttribute("added")) {{
            const audioElStream = audioContext.createMediaStreamSource(audioEl.srcObject);
            audioEl.setAttribute("added", "true");
            audioElStream.connect(dest);
          }}
        }});
      }}, 1000);

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ]);

      const [videoChunks] = await Promise.all([
        startRecording(combinedStream),
      ]);
      let recordedBlob = new Blob(videoChunks, {{ type: "video/webm" }});

      fetch("{put_signed_url}", {{
        method: "PUT",
        headers: {{
          'Content-Type': "video/webm"
        }},
        body: recordedBlob
      }}).then(response => {{
        if(response.ok) {{
          console.log("Video uploaded successfully");
          window.recordingFinished = true;
        }} else {{
          console.error("Error uploading video", response);
          window.recordingFinished = false;
        }}
      }});

      screenStream.getTracks().forEach(track => track.stop());
      dest.stream.getTracks().forEach(track => track.stop());
    }});
  """)
    WebDriverWait(driver, 120).until(
    lambda d: d.execute_script("return window.recordingFinished === true")
    )
    print(" I am here")

    driver.close()

    db = SessionLocal()

    recording = Recording(
        id= uuid.uuid4(),
        meeting_id= meet_id,
        file_name=file_name,
        uploaded_at= datetime.utcnow()
    )
    db.add(recording)
    db.commit()
    