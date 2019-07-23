const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../config/client_secret.json');
const { spreadsheetId } = require('../config/config_test_file');

//Create a document object using the ID of the spreadsheet
const doc = new GoogleSpreadsheet(spreadsheetId);

//Authenticate with the Google Spreadsheets API
doc.useServiceAccountAuth(creds, err => {
  //Get all of the rows from the spreadsheet.
  doc.getRows(1, (err, rows) => {
    console.log(rows);
  });
});
