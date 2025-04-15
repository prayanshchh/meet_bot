import { By, until, WebDriver } from 'selenium-webdriver';

export async function openMeet(driver: WebDriver, meetUrl: string): Promise<boolean> {
  await driver.get(meetUrl);

  try {
    const nameInput = await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Your name"]')), 10000);
    await nameInput.clear();
    await nameInput.sendKeys('Meeting bot');
  } catch {}

  try {
    const joinButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')), 10000);
    await joinButton.click();
    try {
        const cannotJoinHeader = await driver.wait(
            until.elementLocated(By.xpath('//h1[@jsname="r4nke" and text()="You can\'t join this video call"]')),
            10000
          );
        await driver.wait(until.elementIsVisible(cannotJoinHeader), 3000);
        console.log("Bot is blocked from joining.");
        return false;
      } catch (e) {
      }
  } catch {
    
  }

  try {
    const muteButton = await driver.wait(
      until.elementLocated(By.xpath('//button[@data-is-muted="false" and @aria-label="Turn off microphone"]')),
      10000
    );
    await muteButton.click();
  } catch {}

  try {
    const gotItButton = await driver.wait(
      until.elementLocated(By.xpath('//button[.//span[text()="Got it"]]')),
      5000
    );
    await gotItButton.click();
  } catch {}

  return true;
}