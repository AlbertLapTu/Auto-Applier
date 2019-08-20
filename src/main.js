const puppeteer = require('puppeteer');
const { parseJobLinks, writeToSpreadsheet } = require('./GoogleSheets.js');
const { applyToAllJobs, logIn } = require('./puppeteer');
const Recruiter = require('./Classes/Recruiter');

const automationApplier = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await logIn(page);

  const jobLinks = await parseJobLinks();
  const updatedJobLinks = await applyToAllJobs(page, jobLinks);

  for (let job of updatedJobLinks) {
    const { company, position, date, recruiterName, domainName } = job;
    const recruiter = await new Recruiter(recruiterName, domainName);
    const recruiterEmail = await recruiter.findRecruiter();

    await writeToSpreadsheet(company, position, date, recruiterName, recruiterEmail, domainName);
  }

  browser.close();
};

automationApplier();
