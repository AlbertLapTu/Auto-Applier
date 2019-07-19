const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://reddit.com');
  await page.screenshot({ path: 'samplePage.jpg' });

  await browser.close();
})();
