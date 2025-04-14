import { Builder, Browser } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export async function getDriver() {
  const options = new Options();
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

  return await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
}