const puppeteer = require('puppeteer');
const { getSpreadsheetAccess, parseJobLinks, writeToSpreadsheet } = require('./GoogleSheets.js');
const { applyToAllJobs, logIn } = require('./puppeteer');
const Recruiter = require('./Classes/Recruiter');

const automationApplier = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await logIn(page);

  const jobLinks = await parseJobLinks();

  const updatedJobLinks = await applyToAllJobs(page, jobLinks);
};

automationApplier();
