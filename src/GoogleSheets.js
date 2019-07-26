const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../config/client_secret.json');
const { spreadsheetId } = require('../config/config_test_file');
const { promisify } = require('util');

/**
 * @description: This function will automatically grab all of the rows within the first spreadsheet
 * that you have listed, and returns back an array of objects that contain all the columns/rows.
 */

module.exports = {
  getSpreadsheetAccess: async () => {
    const doc = new GoogleSpreadsheet(spreadsheetId);
    await promisify(doc.useServiceAccountAuth)(creds);
    const sheetInfo = await promisify(doc.getInfo)();
    const currentSheet = sheetInfo.worksheets[0];

    const rows = await promisify(currentSheet.getRows)({
      offset: 1,
      limit: 120,
      query: 'applied = no and hashyperlink = true'
    });

    /**
     * @description: Return value rows is an array of spreadsheet items for that specific sheet.
     */

    return rows;
  },

  writeToSpreadsheet: async () => {
    const rows = await getSpreadsheetAccess();
    const currentDate = new Date().toLocaleDateString();

    rows.forEach(entry => {
      entry.date = currentDate;
      entry.applied = 'yes';
      entry.save();
    });
  }
};
