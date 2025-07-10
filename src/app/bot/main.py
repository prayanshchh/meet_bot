import asyncio
from playwright.async_api import async_playwright
from app.bot.utils.open_meet import open_meet
from app.bot.utils.record_meeting import record_meeting
from app.bot.utils.wait_for_xpath import wait_for_text

async def main(url, id):
    print("I am here")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream",
            ]
        )
        context_args = {
            "viewport": {"width": 1080, "height": 720},
            "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "record_video_dir": "/tmp/playwright-videos",
            "storage_state": "meetbot_auth.json",
            "permissions": ["microphone", "camera"]
        }
        print("browser started")
        context = await browser.new_context(**context_args)
        page = await context.new_page()
        await open_meet(page, url)
        print("Waiting for meeting to end (host ends call)...")
        await wait_for_text(page, "Return to home screen", timeout=60*60*1000)  # Wait up to 1 hour
        print("Meeting ended, closing browser and uploading recording...")
        await context.close()
        await browser.close()
        await record_meeting(page, id)

if __name__ == "__main__":
    asyncio.run(main())
