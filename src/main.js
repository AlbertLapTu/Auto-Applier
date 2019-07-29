const puppeteer = require('puppeteer');
const { parseJobLinks, writeToSpreadsheet } = require('./GoogleSheets.js');
const { applyToAllJobs, logIn } = require('./puppeteer');

const automationApplier = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await logIn(page);

  const jobLinks = await parseJobLinks();

  const updatedJobLinks = await applyToAllJobs(page, jobLinks);
  for (job of updatedJobLinks) {
    const { company, position, date, hasApplied, recruiterName, domainName } = job;

    await writeToSpreadsheet(company, position, date, hasApplied, recruiterName, domainName);
  }

  browser.close();
};

automationApplier();
