from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def open_meet(driver, meet_url: str) -> bool:
  driver.get(meet_url)
  print(driver, "I am at meet")
  wait = WebDriverWait(driver, 10)

  try:
    continue_button = wait.until(EC.presence_of_element_located((By.XPATH, '//span[@jsname="V67aGc" and contains(text(), "Continue without microphone and camera")]')))
    continue_button.click()
  except:
    pass

  try:
    name_input = wait.until(EC.presence_of_element_located((By.XPATH, '//input[@placeholder="Your name"]')))
    name_input.clear()
    name_input.send_keys("meetbot")
  except:
    pass
  
  try:
    join_button = wait.until(EC.presence_of_element_located((By.XPATH, '//span[contains(text(), "Ask to join")]')))
    join_button.click()
    try:
      cannot_join_header = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.Xpath, '//h1[@jsname="r4nke" and text()="You can\'t join this video call"]')))
      WebDriverWait(driver, 3).until(EC.visibility_of(cannot_join_header))
      return False
    except:
      pass
  except:
    pass

  try:
    mute_button = wait.until(EC.presence_of_element_located((By.XPATH, '//button[@data-is-muted="false" and @aria-label="Turn off microphone"]')))
    mute_button.click()
  except:
    pass
  
  try:
    got_it_button = wait.until((EC.element_to_be_clickable((By.XPATH, '//button[.//span[text()="Got it"]]'))))
    got_it_button.click()
  except:
    pass

  return True