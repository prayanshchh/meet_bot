async def go_to_page(page, url: str):
    """
    Navigates the given Playwright page to the specified URL.
    """
    await page.goto(url)
    print(f"Navigated to {url}") 