const puppeteer = require('puppeteer');
const { username, password } = require('../config/config_test_file.js');

/**
 * @description: Running this function with headless set to true triggers a captcha page and will break
 * the function. Always set headless to be false in order to not trigger captcha page.
 *
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
    await page.waitForSelector(emailTextField);
    await page.type(emailTextField, username);
    await page.waitForSelector(passwordTextField);
    await page.type(passwordTextField, password);
    await page.click(submitBtn);
  } catch (err) {
    throw new Error('Invalid error logging in. Check headless browser setting');
  }
};

logIn();
