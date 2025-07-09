import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto("https://accounts.google.com/")
        print("Please log in manually as the meetbot user. After login, close the browser window.")
        # Wait for user to finish login
        input("Press Enter after you have logged in and closed the browser window...")
        await context.storage_state(path="meetbot_auth.json")
        await browser.close()
        print("Authentication state saved to meetbot_auth.json.")

if __name__ == "__main__":
    asyncio.run(main())
