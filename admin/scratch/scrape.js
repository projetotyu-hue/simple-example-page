import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://faber-shop.live/checkout', { waitUntil: 'networkidle2' });
  
  const html = await page.content();
  const fs = await import('fs');
  fs.writeFileSync('checkout-dom.html', html);
  
  await page.screenshot({ path: 'checkout.png', fullPage: true });
  
  await browser.close();
})();
