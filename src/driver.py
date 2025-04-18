from selenium import webdriver;
from selenium.webdriver.chrome.options import Options;

def get_driver():
    options = Options()

    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    
    options.add_experimental_option("prefs", {
        "webrtc.ip_handling_policy": "disable_non_proxied_udp",
        "webrtc.multiple_routes_enabled": False,
        "webrtc.nonproxied_udp_enabled": False,
    })

    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--use-fake-ui-for-media-stream")
    options.add_argument("--window-size=1080,720")
    options.add_argument('--auto-select-desktop-capture-source=[RECORD]')
    options.add_argument('--enable-usermedia-screen-capturing')
    options.add_argument('--auto-select-tab-capture-source-by-title=Meet')
    options.add_argument('--allow-running-insecure-content')

    driver = webdriver.Chrome(options=options)
    return driver