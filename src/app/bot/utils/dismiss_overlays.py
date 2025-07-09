from .click_if_visible import click_if_visible

async def dismiss_overlays(page):
    selectors = [
        'button:has-text("Got it")',
        'button:has-text("Dismiss")',
        'button:has-text("Continue")',
    ]
    for sel in selectors:
        await click_if_visible(page, sel, 1000)
    await page.keyboard.press("Escape")
    await page.wait_for_timeout(300)
    await page.keyboard.press("Escape") 