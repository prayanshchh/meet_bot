async def click_join(page):
    possible_texts = [
        "Join now", "Ask to join", "Join meeting", "Join call", "Join", "Done",
        "Continue", "Continue to join", "Start meeting"
    ]
    for text in possible_texts:
        btn = page.locator(f'button:has-text("{text}")').first
        try:
            await btn.wait_for(state="visible", timeout=3000)
            await btn.click()
            print(f'Clicked join button: "{text}"')
            return
        except Exception:
            continue
    # Fallback: press Enter
    print("No join button found — pressing Enter as fallback")
    await page.keyboard.press("Enter") 