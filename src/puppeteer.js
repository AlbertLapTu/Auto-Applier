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
  } catch (err) {
    throw new Error('No inner text available');
  }
  return innerText;
};

const parseCompanyAndJobTitle = async (page, url) => {
  const header = '.u-colorGray3';

  try {
    await page.goto(url);
    const companyAndTitle = await getTextValue(page, header);
    const splitHeader = companyAndTitle.split(' at ');
    let jobTitle = splitHeader[0];

    //TODO: Test to see if this works
    if (jobTitle.includes('-')) {
      jobTitle = jobTitle.split(' - ')[0];
    }

    const company = splitHeader[1];

    return [jobTitle, company];
  } catch (err) {
    throw new Error('Error retrieving job title and company name');
  }
};

//TODO: Fix Bug
const getRecruiterName = async page => {
  const applyNowButtonClass = '.buttons.js-apply.applicant-flow-dropdown';

  try {
    const recruiterName = '.name';
    await page.waitForSelector(applyNowButtonClass);
    await page.click(applyNowButtonClass, { delay: 1000 });
    await page.waitForSelector(recruiterName);
    const recruiter = await getTextValue(page, recruiterName);

    return recruiter;
  } catch (err) {
    throw new Error('Cant retrieve recruiter name');
  }
};

//ADD IN PAGE
const getDomainName = async (page, url) => {
  const domainClassName = '.website-link';

  try {
    await page.goto(url);
    await page.waitForSelector(domainClassName);

    let result = await getTextValue(page, domainClassName);
    return result;
  } catch (err) {
    throw new Error('error receiving domain name');
  }
};

const pasteCoverLetter = async (page, hiringManager, position, company) => {
  const textArea = 'textarea[name=note]';
  const sendApplicationButton = '.c-button.c-button--blue';

  try {
    await page.waitFor('.container');
    await page.waitForSelector(textArea);
    const coverLetterText = await coverLetter(hiringManager, position, company);
    await page.type(textArea, coverLetterText);
  } catch (err) {
    throw new Error('Error in pasteCoverLetter function');
  }
};

// FIX URL to be the URL you get from the Google sheet
const apply = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const URL = 'https://angel.co/company/swiftlane/jobs/559263-software-engineer-infra-and-backend';

  await logIn(page);
  await page.goto(URL);
  const [jobTitle, company] = await parseCompanyAndJobTitle(page, URL);
  const domainName = await getDomainName(page, URL);
  const recruiter = await getRecruiterName(page);

  await pasteCoverLetter(page, recruiter, jobTitle, company);
};
