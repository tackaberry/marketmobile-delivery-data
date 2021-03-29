const { GoogleSpreadsheet } = require("google-spreadsheet");

const { GOOGLE_CREDENTIALS, GOOGLE_SHEETS_ID } = process.env;
const credentials = JSON.parse(GOOGLE_CREDENTIALS);

const service = {};

service.put = async (fields, data) => {
  console.log("[google sheets service] put");
  // Create a document object using the ID of the spreadsheet - obtained from its URL.

  const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_ID);
  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[1];
  await sheet.clear();
  await sheet.setHeaderRow(fields);
  await sheet.addRows(data);
};

service.append = async (data) => {
  console.log("[google sheets service] append");
  // Create a document object using the ID of the spreadsheet - obtained from its URL.

  const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_ID);
  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[1];
  await sheet.addRows(data);
};

service.fetch = async (index) => {
  console.log("[google sheets service] delivery data");
  // Create a document object using the ID of the spreadsheet - obtained from its URL.

  const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_ID);
  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[index];
  const rows = await sheet.getRows();
  const out = rows.map((row) => {
    const rowOut = {};
    sheet.headerValues.forEach((header) => {
      rowOut[header] = row[header];
    });
    return rowOut;
  });
  return out;
};

module.exports = service;
