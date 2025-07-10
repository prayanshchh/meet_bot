async def fill_input_by_xpath(page, xpath: str, text: str):
    """
    Fills an input element matching the given XPath with the provided text. Uses Playwright's auto-waiting.
    """
    try:
        await page.locator(f'xpath={xpath}').fill(text)
        print(f"Filled input {xpath} with text: {text}")
    except Exception as e:
        print(f"Failed to fill input {xpath}: {e}") 