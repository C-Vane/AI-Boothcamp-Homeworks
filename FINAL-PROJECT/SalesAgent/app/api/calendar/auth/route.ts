import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import dbConnect from "@/lib/db/connect";
import { getSession } from 'next-auth/react';
import User from "@/models/User";

// Configure Google Calendar
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/callback/google'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get the session to identify the logged-in user
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch the logged-in user's details
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.googleAccessToken) {
      return res.status(404).json({ error: 'User not found or not connected to Google' });
    }

    // Set the user's Google access token
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    // Fetch events from the user's Google Calendar
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Process the events as needed
    console.log('Fetched events:', events.data.items);

    return res.status(200).json({ success: true, events: events.data.items });
  } catch (error) {
    console.error('Error syncing with Google:', error);
    return res.status(500).json({ error: 'Failed to sync with Google' });
  }
} 