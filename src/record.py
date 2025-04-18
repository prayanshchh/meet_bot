from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utilities.generatePresignedURL import generate_upload_url;
from selenium.webdriver.support.ui import WebDriverWait

def   start_screenshare(driver):
    import time

    file_name = f"meeting-{int(time.time())}.webm"
    signed_url = generate_upload_url(file_name)
    meesage = """Hello everyone!
    I’m MeetBot, your AI-powered assistant for this session. I’ll be silently recording the meeting and capturing key points to generate accurate notes and summaries for everyone afterward. My goal is to help you stay focused and reduce the need for manual note-taking.

    If you have any action items, important topics, or questions you'd like emphasized, feel free to mention them in the chat. I’ll do my best to highlight those in the final summary. Wishing you a productive meeting."""
    
    wait = WebDriverWait(driver, 90)
    chat_button = wait.until(EC.presence_of_element_located((By.XPATH, '//button[@aria-label="Chat with everyone"]')))
    chat_button.click()

    input_box = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//textarea[@aria-label="Send a message" or @placeholder="Send a message"]')))
    input_box.send_keys(meesage + Keys.RETURN)
    chat_button.click()

    print("I am here")

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

      fetch("{signed_url}", {{
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
    print("Recording started")
    WebDriverWait(driver, 120).until(
    lambda d: d.execute_script("return window.recordingFinished === true")
    )