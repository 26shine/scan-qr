import { google } from 'googleapis';

async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './gg-sheet-425515-73649feb7a51.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });

  const spreadsheetId = '1YSi8RrijxAB963sX-vB2WpCAubS-eLyz6BHo7uysx5I';
  const range = 'Sheet1!A1:D10'; // Adjust the range as needed

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values;
  if (rows?.length) {
    console.log('Data:', rows);
  } else {
    console.log('No data found.');
  }
}

getSheetData().catch(console.error);
