async def click_if_visible(page, selector: str, timeout: int = 5000):
    try:
        elem = page.locator(selector)
        await elem.wait_for(state="visible", timeout=timeout)
        try:
            await elem.click()
            return True
        except Exception:
            # Fallback: try clicking via JS
            await page.evaluate('(el) => el.click()', await elem.element_handle())
            return True
    except Exception:
        # Fallback: try [role=button][aria-label*="..."] if not already tried
        if '[role="button"]' not in selector and 'aria-label' in selector:
            alt_selector = selector.replace('button', '[role="button"]')
            try:
                elem = page.locator(alt_selector)
                await elem.wait_for(state="visible", timeout=timeout)
                try:
                    await elem.click()
                    return True
                except Exception:
                    await page.evaluate('(el) => el.click()', await elem.element_handle())
                    return True
            except Exception:
                pass
        return False 