import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        print("Navigating to home...")
        await page.goto("https://faber-shop.live/")
        
        print("Clicking first product...")
        # find the first product link
        await page.click('a[href*="/produtos/"], a[href*="/produto/"]')
        await page.wait_for_load_state("networkidle")
        
        print("Clicking buy button...")
        # find the buy button
        # Usually it's a button with text "Comprar", "Comprar agora", "Adicionar ao carrinho"
        buttons = await page.locator("button").all()
        for b in buttons:
            text = await b.text_content()
            if text and ("comprar" in text.lower() or "adicionar" in text.lower() or "garantir" in text.lower()):
                await b.click()
                break
                
        await page.wait_for_timeout(3000)
        print("Navigating to checkout...")
        await page.goto("https://faber-shop.live/checkout")
        await page.wait_for_load_state("networkidle")
        
        html = await page.content()
        with open("scratch/checkout_real.html", "w") as f:
            f.write(html)
        await page.screenshot(path="scratch/checkout_real.png", full_page=True)
        await browser.close()
        print("Done")

asyncio.run(main())
