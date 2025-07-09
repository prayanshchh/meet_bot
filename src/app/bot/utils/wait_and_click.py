async def wait_and_click(page, xpath: str, timeout: int = 10000):
    """
    Waits for an element matching the given XPath to appear and clicks it. Uses Playwright's auto-waiting.
    """
    try:
        await page.locator(f'xpath={xpath}').click(timeout=timeout)
        print(f"Waited for and clicked element with XPath: {xpath}")
    except Exception as e:
        print(f"Failed to wait and click element with XPath {xpath}: {e}") 