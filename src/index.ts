// src/index.ts
import { getDriver } from './driver';
import { openMeet } from './meeting';
import { startScreenshare } from './record';

async function main() {
  const meetUrl = 'https://meet.google.com/rmk-spqm-cyr';
  let joined = false;

  for (let i = 0; i < 10; i++) {
    const driver = await getDriver();
    joined = await openMeet(driver, meetUrl);
    if (joined) {
      await startScreenshare(driver);
      break;
    }
  }

  if (!joined) {
    console.log('❌ Bot could not join the meeting after 10 attempts.');
  }
}

main();