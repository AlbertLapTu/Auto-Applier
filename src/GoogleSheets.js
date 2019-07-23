const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../config/client_secret.json');
const { spreadsheetId } = require('../config/config_test_file');
const { promisify } = require('util');

/**
 *
 * @description: This function will automatically grab all of the rows within the first spreadsheet
 * that you have listed, and returns back an array of objects that contain all the columns/rows.
 */
const getSpreadsheetAccess = async () => {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  await promisify(doc.useServiceAccountAuth)(creds);
  // doc.getRows(1, (err, rows) => console.log(rows));
  const sheetInfo = await promisify(doc.getInfo)();
  const currentSheet = sheetInfo.worksheets[0];

  const rows = await promisify(currentSheet.getRows)({
    offset: 1,
    limit: 120,
    query: 'applied = no and hashyperlink = true'
  });

  console.log(rows);
  return rows;
};

getSpreadsheetAccess();

/**
 * @description: updateSpreadsheet will update the date in which you applied, and will update with
 * the recruiter name, email and domain?
 */
