async def wait_for_xpath(page, xpath: str, timeout: int = 10000):
    """
    Waits for an element matching the given XPath to appear on the page.
    Returns the locator if found, else None.
    """
    locator = page.locator(f'xpath={xpath}')
    try:
        await locator.wait_for(state="visible", timeout=timeout)
        print(f"Element found with XPath: {xpath}")
        return locator
    except Exception as e:
        print(f"Element not found with XPath {xpath}: {e}")
        return None

async def wait_for_text(page, text: str, timeout: int = 60000):
    locator = page.get_by_text(text, exact=True)
    try:
        await locator.wait_for(state="visible", timeout=timeout)
        print(f"Element with text '{text}' appeared.")
        return locator
    except Exception as e:
        print(f"Element with text '{text}' did not appear: {e}")
        return None 