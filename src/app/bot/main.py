import asyncio
from playwright.async_api import async_playwright
from app.bot.utils.open_meet import open_meet, close_browser
from app.bot.utils.record_meeting import record_meeting
from app.bot.utils.wait_for_xpath import wait_for_text

async def main(url, id):
    print("I am here")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream",
                "--use-file-for-fake-audio-capture=/app/src/app/silence.wav",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--autoplay-policy=no-user-gesture-required"
            ]
        )
        context_args = {
            "viewport": {"width": 1080, "height": 720},
            "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "storage_state": "meetbot_auth.json",
            "permissions": ["microphone", "camera"]
        }
        print("browser started")
        context = await browser.new_context(**context_args)
        page = await context.new_page()
        video_path = await open_meet(page, context, url, "/tmp/playwright-videos", id)
        print("Meeting ended, closing browser and uploading recording...")
        await close_browser(context, browser)
        await record_meeting(video_path, id)

if __name__ == "__main__":
    asyncio.run(main())
