async def captions_region_visible(page, t=4000):
    region = page.locator('[role="region"][aria-label*="Captions"]')
    try:
        await region.wait_for(timeout=t)
        if await region.is_visible():
            return True
        return True
    except Exception:
        return False

async def ensure_captions_on(page, timeout_ms=60000):
    print(" Waiting for UI to stabilize after join...")
    await page.wait_for_timeout(5000)
    # close overlays if blocking interaction
    overlay = page.locator('div[data-disable-esc-to-close="true"]')
    for _ in range(8):
        try:
            visible = await overlay.is_visible()
        except Exception:
            visible = False
        if not visible:
            break
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(200)
    # keyboard shortcut with limited attempts
    for i in range(10):
        print(f"Attempt {i+1}: Pressing Shift+C")
        await page.keyboard.down("Shift")
        await page.keyboard.press("c")
        await page.keyboard.up("Shift")
        if await captions_region_visible(page, 800):
            print("Captions enabled via Shift+C")
            return
        cc_off_btn = page.locator('button[aria-label*="Turn off captions"]')
        try:
            cc_off_btn_visible = await cc_off_btn.is_visible()
        except Exception:
            cc_off_btn_visible = False
        if cc_off_btn_visible:
            print("Captions are already ON (confirmed by CC button state)")
            return
        await page.wait_for_timeout(600)
    # fallback, click "Turn on captions" button
    print(' Falling back to clicking "Turn on captions" button...')
    await page.mouse.move(500, 700)
    await page.wait_for_timeout(300)
    cc_button = page.locator('button[aria-label*="Turn on captions"]')
    try:
        await cc_button.wait_for(state="visible", timeout=4000)
        await cc_button.click()
        if await captions_region_visible(page, 5000):
            print("captions enabled via CC button fallback")
            return
    except Exception:
        print("CC button fallback failed")
    # debug info if captions aren't on
    visible_regions = await page.locator('[role="region"]').all_text_contents()
    print("visible regions:", visible_regions)
    regions = await page.locator('[role="region"]').element_handles()
    for r in regions:
        label = await r.get_attribute("aria-label")
        print("Region aria-label:", label)
    timestamp = int(await page.evaluate('Date.now()'))
    path = f"/tmp/captions-failure-{timestamp}.png"
    await page.screenshot(path=path)
    print(f"captions could not be enabled – see {path}")
    raise Exception("could not enable captions using Shift+C or button") 