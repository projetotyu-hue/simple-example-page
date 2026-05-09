const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  console.log("Navigating to home...");
  await page.goto('https://faber-shop.live/', { waitUntil: 'networkidle2' });
  
  console.log("Clicking the first product...");
  // Assume there is an <a> link containing an href to a product
  const productLink = await page.$('a[href*="/produtos/"], a[href*="/produto/"]');
  if (productLink) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      productLink.click(),
    ]);
  } else {
    console.log("No product link found. Trying to go to /produtos/1 directly");
    await page.goto('https://faber-shop.live/produtos/1', { waitUntil: 'networkidle2' });
  }

  console.log("Adding to cart...");
  // Click the "comprar" or "adicionar" button.
  // We can just look for a button that has text like 'Comprar' or 'Adicionar'
  const buyButton = await page.$x("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'comprar')]");
  if (buyButton.length > 0) {
    await buyButton[0].click();
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log("Navigating to checkout...");
  await page.goto('https://faber-shop.live/checkout', { waitUntil: 'networkidle2' });
  
  const html = await page.content();
  fs.writeFileSync('../checkout_filled.html', html);
  await page.screenshot({ path: '../checkout_filled.png', fullPage: true });
  
  await browser.close();
  console.log("Done");
})();
