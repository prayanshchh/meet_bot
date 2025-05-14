from app.bot.driver import get_driver
from app.bot.meeting import open_meet
from app.bot.record import start_screenshare

def main(meet_url, meet_id):
    driver = get_driver()
    joined = open_meet(driver, meet_url)

    if joined:
        start_screenshare(driver, meet_id)
if __name__ == "__main__":
    main()
