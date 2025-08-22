import fs from 'fs/promises';
import path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google, calendar_v3, Auth } from 'googleapis';

const CALENDAR_ID = 'primary';
const TIME_ZONE = 'America/Los_Angeles';
const SCOPES: string[] = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = './credentials.json';

async function loadSavedCredentialsIfExist(): Promise<Auth.OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());
    return google.auth.fromJSON(credentials) as Auth.OAuth2Client;
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: Auth.OAuth2Client): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys: any = JSON.parse(content.toString());
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

export async function authorize(): Promise<Auth.OAuth2Client> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }

  client = (await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })) as Auth.OAuth2Client;

  if (client.credentials) {
    await saveCredentials(client);
  }

  return client;
}

export async function listEvents(auth: Auth.OAuth2Client): Promise<void> {
  try {
    const calendar: calendar_v3.Calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: TIME_ZONE,
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
    }

    console.log('Upcoming 10 events:');
    events.map((event, i) => {
      const start = event.start?.dateTime || event.start?.date;
      console.log(`${start} - ${event.summary}`);
    });
  } catch (err) {
    console.error('Error retrieving events:', err);
  }
}