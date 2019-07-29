const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../config/client_secret.json');
const { spreadsheetId } = require('../config/config_test_file');
const { promisify } = require('util');

/**
 * @description: This function will automatically grab all of the rows within the first spreadsheet
 * that you have listed, and returns back an array of objects that contain all the columns/rows.
 */

const getSpreadsheetAccess = async () => {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  await promisify(doc.useServiceAccountAuth)(creds);
  const sheetInfo = await promisify(doc.getInfo)();
  const currentSheet = sheetInfo.worksheets[0];

  const rows = await promisify(currentSheet.getRows)({
    offset: 1,
    limit: 120,
    query: 'applied = no and hashyperlink = true'
  });
  return rows;
};

/**
 * @description: parseJobLinks is the shell function that returns a list an array of jobs that has
 * been parsed out of the google sheet. Access to the sheet object is provided via the getSpreadsheetAccess
 * function
 */

const parseJobLinks = async () => {
  const googleSheetEntries = await getSpreadsheetAccess();
  const jobLinks = [];

  // NOTE: Potential for refactor, as for loops are blocking.
  for (let i = 0; i < googleSheetEntries.length; i++) {
    jobLinks.push(googleSheetEntries[i].link);
  }
  return jobLinks;
};

const writeToSpreadsheet = async (
  company,
  position,
  date,
  recruiterName,
  recruiterEmail,
  domainName
) => {
  const rows = await getSpreadsheetAccess();

  rows.forEach(entry => {
    entry.company = company;
    entry.position = position;
    entry.date = date;
    entry.applied = 'YES';
    entry.recruiter = recruiterName;
    entry.email = recruiterEmail;
    entry.domain = domainName;
    entry.save();
  });
};

module.exports = {
  getSpreadsheetAccess,
  parseJobLinks,
  writeToSpreadsheet
};
