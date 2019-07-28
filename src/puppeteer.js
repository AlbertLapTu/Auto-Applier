const { username, password } = require('../config/config_test_file.js');
const { Job } = require('./Classes/Job');
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

const parseCompanyAndJobTitle = async page => {
  const header = '.u-colorGray3';

  try {
    // await page.goto(url);
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

/**
 *
 * @description: Creates a new job class object. Intended to use in the update spreadsheet function such
 * that we can update each job.
 *
 * Job class requires company, position, date, hasApplied, recruiterName, recruiterEmail, and domain name.
 */

const createUpdatedJob = (company, position, date, recruiterName, domainName) => {
  const updatedJob = new Job(
    company,
    position,
    date,
    recruiterName,
    (hasApplied = 'yes'),
    domainName
  );

  return updatedJob;
};

/**
 * @description: This function individually applies to a job (given a provided link) and returns a Job
 * class object which contains all of the updated information to be saved into your job tracker.
 */

const applyToJobAndUpdateJobEntry = async (page, url) => {
  const submitBtn = '.fontello-paper-plane';

  await page.goto(url);
  const [jobTitle, company] = await parseCompanyAndJobTitle(page);
  const domainName = await getDomainName(page, url);
  const recruiter = await getRecruiterName(page);
  const date = new Date().toLocaleString();
  await pasteCoverLetter(page, recruiter, jobTitle, company);
  await page.waitForSelector(submitBtn);
  await page.click(submitBtn);

  return createUpdatedJob(company, jobTitle, date, recruiter, domainName);
};

/**
 * @description: This function will iterate over each job link entry and return an array of updated
 * jobs to be saved to your job tracker.
 */

const applyToAllJobs = async (page, jobLinks) => {
  const updatedJobs = [];
  let i = 0;

  while (i < jobLinks.length) {
    const currentJob = jobLinks[i];
    const updatedJobEntry = await applyToJobAndUpdateJobEntry(page, currentJob);
    updatedJobs.push(updatedJobEntry);
    i++;
  }
  return updatedJobs;
};

module.exports = {
  applyToAllJobs,
  logIn
};
