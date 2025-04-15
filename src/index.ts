import { getDriver } from './driver';
import { openMeet } from './meeting';
import { startScreenshare } from './record';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const meetUrl = 'https://meet.google.com/rmk-spqm-cyr';
  let joined = false;
  const driver = await getDriver();

    joined = await openMeet(driver, meetUrl);
    if (joined) {
      await startScreenshare(driver);
    }
    }

main();