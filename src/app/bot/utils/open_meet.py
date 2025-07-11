from app.bot.utils.click_if_visible import click_if_visible
from app.bot.utils.click_join import click_join
from app.bot.utils.dismiss_overlays import dismiss_overlays
from app.bot.utils.wait_until_joined import wait_until_joined
from app.bot.utils.ensure_captions_on import ensure_captions_on
from app.bot.utils.record_meeting_with_script import record_meeting_with_script

async def collapse_preview_if_needed(page):
    preview_join = page.get_by_role("button", name="join now", exact=False).nth(1)
    try:
        if await preview_join.is_visible(timeout=3000):
            await preview_join.click()
            print("Clicked 2-step Join")
    except Exception:
        pass

async def open_meet(page, context, url: str, download_dir: str, meeting_id: str):
    await page.goto(url)
    await click_if_visible(page, '[role="button"][aria-label*="Turn off microphone"]')
    await click_if_visible(page, '[role="button"][aria-label*="Turn off camera"]')
    await click_if_visible(page, 'button:has-text("Got it")')
    await click_join(page)
    await collapse_preview_if_needed(page)
    await dismiss_overlays(page)
    await wait_until_joined(page)
    # Start recording and wait for meeting to end
    video_path = await record_meeting_with_script(page, context, download_dir)
    return video_path

async def close_browser(context, browser):
    await context.close()
    await browser.close()