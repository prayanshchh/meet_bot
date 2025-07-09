from utils.click_if_visible import click_if_visible
from utils.click_join import click_join
from utils.dismiss_overlays import dismiss_overlays
from utils.wait_until_joined import wait_until_joined
from utils.ensure_captions_on import ensure_captions_on

async def collapse_preview_if_needed(page):
    preview_join = page.get_by_role("button", name="join now", exact=False).nth(1)
    try:
        if await preview_join.is_visible(timeout=3000):
            await preview_join.click()
            print("Clicked 2-step Join")
    except Exception:
        pass

async def open_meet(page, url: str):
    await page.goto(url)
    # Mute mic, turn off camera, clear popup
    await click_if_visible(page, '[role="button"][aria-label*="Turn off microphone"]')
    await click_if_visible(page, '[role="button"][aria-label*="Turn off camera"]')
    await click_if_visible(page, 'button:has-text("Got it")')
    await click_join(page)
    await collapse_preview_if_needed(page)
    await dismiss_overlays(page)
    await wait_until_joined(page)
    await ensure_captions_on(page)
