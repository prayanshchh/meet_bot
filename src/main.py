import time
from driver import get_driver
from meeting import open_meet
from record import start_screenshare

def wait(ms):
    time.sleep(ms / 1000)

def main():
    meet_url = 'https://meet.google.com/rmk-spqm-cyr'

    driver = get_driver()
    joined = open_meet(driver, meet_url)

    if joined:
        start_screenshare(driver)
if __name__ == "__main__":
    main()
