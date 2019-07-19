const puppeteer = require('puppeteer');
const { username, password } = require('../config/config_test_file.js');

/*

Example on how to launch pupetteer

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://reddit.com');
  await page.screenshot({ path: 'samplePage.jpg' });

  await browser.close();
})();

*/

/**
 * @description: Headless browser triggers a captcha page. Must open up Chromium by setting the
 * headless option to false and log in through that.
 */
const logIn = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const loginPage = 'https://angel.co/login';
  const emailTextField = '#user_email';
  const passwordTextField = '#user_password';
  const submitBtn = '.c-button';

  try {
    await page.goto(loginPage);
    await page.waitForSelector('#user_email');
    await page.type('#user_email', username);
    await page.waitForSelector('#user_password');
    await page.type('#user_password', password);
    await page.click('.c-button');

    await page.screenshot({ path: 'samplePage.jpg' });
  } catch (err) {
    throw new Error('Invalid error logging in. Check headless browser setting');
  }
};

logIn();
