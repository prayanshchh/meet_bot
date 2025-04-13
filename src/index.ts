import { Builder, Browser, By, Key, until } from 'selenium-webdriver'
import {Options} from 'selenium-webdriver/chrome'

async function main() {
  const options = new Options({});
  options.addArguments('--disable-blink-features=AutomationControlled');
  options.addArguments('--use-fake-ui-for-media-stream');
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
  try {
    await driver.get('https://meet.google.com/rmk-spqm-cyr')
    const popupButton  = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Got it")]'
)), 10000);
    await popupButton.click();
    const nameInput = await driver.wait(until.elementLocated(By.xpath('//input[contains(@placeholder, "Your Name")]')), 10000);
    await driver.wait(until.elementIsVisible(nameInput), 5000);
    await nameInput.clear();
    await nameInput.click();
    await nameInput.sendKeys('value', 'meeting bot');
    const buttonInput = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Ask to join") or contains(text(), "Join")]')), 10000);
    buttonInput.click();

  } finally {
    // await driver.quit();
  }
}

main();