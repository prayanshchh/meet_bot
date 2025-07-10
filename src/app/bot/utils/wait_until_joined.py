async def wait_until_joined(page, timeout_ms=60000):
    try:
        await page.wait_for_selector('button[aria-label*="Leave call"]', timeout=timeout_ms)
        return
    except Exception:
        pass
    try:
        await page.wait_for_selector("text=You've been admitted", timeout=timeout_ms)
        return
    except Exception:
        pass
    try:
        await page.wait_for_selector("text=You’re the only one here", timeout=timeout_ms)
        return
    except Exception:
        pass
    raise Exception("Not admitted within time limit") 