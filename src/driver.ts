import { Builder, Browser } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export async function getDriver() {
  const options = new Options();
  options.excludeSwitches('enable-automation');

  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--use-fake-ui-for-media-stream");
  options.addArguments("--window-size=1080,720")
  options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
  options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
  options.addArguments('--enable-usermedia-screen-capturing');
  options.addArguments('--auto-select-tab-capture-source-by-title="Meet"')
  options.addArguments('--allow-running-insecure-content');
  

  return await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
}