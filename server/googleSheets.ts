import { google } from "googleapis";

type ServiceAccountCreds = {
  client_email: string;
  private_key: string;
};

function loadServiceAccount(): ServiceAccountCreds {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("Missing env GOOGLE_SERVICE_ACCOUNT_JSON");
  }

  let jsonString = raw.trim();
  if (!jsonString.startsWith("{")) {
    jsonString = Buffer.from(jsonString, "base64").toString("utf8");
  }

  const creds = JSON.parse(jsonString) as ServiceAccountCreds;

  if (typeof creds.private_key === "string") {
    creds.private_key = creds.private_key.replace(/\\n/g, "\n");
  }

  if (!creds.client_email || !creds.private_key) {
    throw new Error("Invalid service account JSON (missing client_email/private_key)");
  }

  return creds;
}

async function getSheetsClient() {
  const creds = loadServiceAccount();

  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendContactToSheet(
  name: string,
  email: string,
  company: string,
  message: string
) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error("Missing env GOOGLE_SHEETS_SPREADSHEET_ID");
  }

  const range = process.env.GOOGLE_SHEETS_RANGE || "Sheet1!A:E";

  const sheets = await getSheetsClient();
  const now = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[name, email, company, message, now]],
    },
  });
}

