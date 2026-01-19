import { google } from "googleapis";

// Env vars required:
// GOOGLE_SHEETS_SPREADSHEET_ID= 1UsiiJ57lVpYmidvqb27azacD1cwa0hDrH1A6NwL9LyA
// GOOGLE_SHEETS_RANGE=Sheet1!A:E   
// GOOGLE_SERVICE_ACCOUNT_JSON=
{
  "type": "service_account";
  "project_id": "nodal-album-484808-t5";
  "private_key_id": "399b96bb82d9f93b4e691c01352ac01bf5129ecd";
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDvJ61r9Ltae0WT\nCEDP9dRggJEulFwgin85Kaz2G1LXL7oXCo8aMcrzOVALqyfx5Lie3pSryC0ZxBtF\nZ+TsZpZzubyuSd7pb4r4fRzWKFXZGP3OsepzUSUgODxs6Vgb+ZPTckCDD00rzhrq\nF1CfZaRGjgBSB7uIws3mADQVDnMVj88NSxUQ5e2N9GLrvSjI+7+DqDnekEoIZOzr\nmICz5HpSA/ZiIIDlRtg/tYta4KwY1r6olUafGNPdr1yykYEBCzHWkv0b9LhxA9i+\n5OWHOdGDV/KUWMtGw6sM8RdIrkMKDMq+PVX/Dzz6R4bXoyseVO7UWpa+NN4AzUrB\n/1a50+GhAgMBAAECggEABqQ3cLQPL+gUeozUH/JXv4ZSgdSk6lJuTgwWPY9ssYUl\nydYFO1j+pdqFmo1aQqFzbxYHUu3wMrL7fuXvuZDvxK73ym9KvXjXhycSUfA00h6b\njc3rEODEAy0MoImqZLx9mnWlzP3zyq+il7WmC4crFLqEz8JfNuESDr0atSr9jy+t\ndhDaUACVT6dvi7LZ96DSsbY51RCiiEtDXHMkFbEpSjWBA4RAo8+oqLe7xK6v0kBk\nw7uDPirGVCUuS1VQMghZrTCmB5L0S0R8NduuSRM8uwSMsyIYRv4zlM55HDhKNslP\nyTQDae8K2MLcWh0CJeYrb+yoYzyPSdWMVKDDsqhSMQKBgQD45tkkFLoYug8qA8aa\n1OQubpceC9YhuEcLtRV/Bh40b2ywzQG3aVTjqds0wdYtvdNWwDs/U67ZWRy3vePb\nzwBOl9eN0pGvbi69Od4LKfzoqmoeGSYLjkWH5kZAYOJMwGaXBvAy74KTbA7nmXJS\ns+pskQFej3qx1oeTFW8l4Z1QQwKBgQD1+avW+8OPBv2HPAWC6iJ+KKE1PdgIrLMG\n8zS5i0dCmQ4Y/Ze7aMYA6RFoizE+pUBPIkOqySk0nxX1VzHubir/uQ9goHUO4zcU\ncDl4W+YCaVjFVavMgiGAsDl60RgjbbmIUg4I59HBxs6wjDS/QCxuRrYCvzEYsuAj\nZPRLXq5KSwKBgQCvbJRyF6Gpt8jkRdD+YzmHeC5N4O3EykpYeAJ0im1Ta4zhdzvU\ndwp7gsWag1te1cFUDRw039gGHAZfghhMXbLLsb0cmeJQEIokl9plZ+x2V1V/bR4h\nWt6qj6PH0ADvM1Oa8irs213eZXSDyuSGYYPBjNm4Ocux94+KHLs/qankXQKBgQCH\n2RtZwXRQ8thkrvaQRgVEzeWyxPQiXlcFuJ5e9xglJOjPTodVXtk0OYR+y5kn8xZg\nXhknIrBaOp5jAIQ4Haorz6Y5hIUB8uVBqXVkDsUqgcogOl+GtDwSmcE1HnQJZRk5\nu6+6pWWIcudGRDkBg0zGntD5FWTlMi1t/tyZH7J8nwKBgQCtnq6cqDG9hRU58TIE\nhR1qJr1d4LG1WBFU/jF5eYhB/sOd+Pcvi9QG+K51/G5BCuslzQOoZiim5hnqI/Aj\nRFHmHicqvOJGsOUDYJbddmskwfudpaAHiH6rDJ6y7huXjWyVGc1lI+prx1q//BPe\n1EI7LDS2eEnfvVFu7wawFOWmiQ==\n-----END PRIVATE KEY-----\n";
  "client_email": "hello-mellemdata-com@nodal-album-484808-t5.iam.gserviceaccount.com";
  "client_id": "101666543164751229015";
  "auth_uri": "https://accounts.google.com/o/oauth2/auth";
  "token_uri": "https://oauth2.googleapis.com/token";
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs";
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/hello-mellemdata-com%40nodal-album-484808-t5.iam.gserviceaccount.com";
  "universe_domain": "googleapis.com";
}
function loadServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing env GOOGLE_SERVICE_ACCOUNT_JSON");

  // Allow either plain JSON or base64 JSON
  const jsonString = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");

  const creds = JSON.parse(jsonString);

  // Render env vars sometimes escape newlines; fix private_key
  if (creds.private_key && typeof creds.private_key === "string") {
    creds.private_key = creds.private_key.replace(/\\n/g, "\n");
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
  if (!spreadsheetId) throw new Error("Missing env GOOGLE_SHEETS_SPREADSHEET_ID");

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
