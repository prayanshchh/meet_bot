async def click_by_xpath(page, xpath: str):
    """
    Clicks the first element matching the given XPath on the page. Relies on Playwright's auto-waiting.
    """
    try:
        await page.locator(f'xpath={xpath}').click()
        print(f"Clicked element with XPath: {xpath}")
    except Exception as e:
        print(f"Failed to click element with XPath {xpath}: {e}") 