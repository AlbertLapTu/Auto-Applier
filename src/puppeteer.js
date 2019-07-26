const puppeteer = require('puppeteer');
const { username, password } = require('../config/config_test_file.js');
const { coverLetter } = require('./coverLetter.js');

/**
 *
 * @param {string} page
 * @description: page refers to the browser page that is instantiated with a headless value of false
 */

const logIn = async page => {
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

/**
 * @param {class} page
 * @param {string} selector
 *
 * @description: Page should be instantiated prior to being passed into this function. The selector
 * should be the element you are trying to get the text value out of.
 */

const getTextValue = async (page, selector) => {
  let innerText;

  try {
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    innerText = page.evaluate(element => element.textContent, element);
  } catch {
    innerText = '';
  }
  return innerText;
};

//TODO: Pass in page, and eliminate the need to open up a new page
const parseCompanyAndJobTitle = async url => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const header = '.u-colorGray3';

  try {
    await page.goto(url);

    const companyAndTitle = await getTextValue(page, header);
    const splitHeader = companyAndTitle.split(' at ');
    const jobTitle = splitHeader[0];
    const company = splitHeader[1];

    return [jobTitle, company];
  } catch (err) {
    console.log(err);
  }
};

//TODO: Fix Bug
const getRecruiterName = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const applyNowButtonClass = '.buttons.js-apply.applicant-flow-dropdown';
  // const shareBtn = '.ds31.shared.fje97.job_showcase_share._a._jm';

  try {
    const recruiterName = '.name';
    await logIn(page);
    await page.goto(
      'https://angel.co/company/swiftlane/jobs/559263-software-engineer-infra-and-backend'
    );
    await page.waitForSelector(applyNowButtonClass);
    // await page.waitForSelector(shareBtn);
    await page.click(applyNowButtonClass, { delay: 1000 });
    // await page.waitForSelector('.blue.facebook.g-button');
    await page.waitForSelector(recruiterName);
    const recruiter = await getTextValue(page, recruiterName);

    return recruiter;
  } catch (err) {
    console.log('Error retrieving recruiter name');
  }
};

//ADD IN PAGE
const getDomainName = async () => {
  const domainClassName = '.website-link';
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(
      'https://angel.co/company/swiftlane/jobs/559263-software-engineer-infra-and-backend'
    );
    await page.waitForSelector(domainClassName);

    let result = await getTextValue(page, domainClassName);
    console.log(result, 'domainName');
    return result;
  } catch (err) {
    console.log(err);
  }
};

const pasteCoverLetter = (hiringManager, position, company) => {
  return coverLetter(hiringManager, position, company);
};

const apply = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await logIn(page);
  let result = await getTextValue(page, '.startup-link');
};
