import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Configure Google Calendar
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/callback/google'
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// GET Available slots in this week
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        //TODO: If no email is provided, then return all available slots???
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Calculate time range for next 7 days
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: oneWeekFromNow.toISOString(),
        items: [{ id: email }],
      },
    });

    // Process busy times to find available slots
    const busySlots = response.data.calendars?.[email]?.busy || [];
    const availableSlots = [];

    // Generate available slots (9 AM to 5 PM, 1-hour slots)
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(now);
      currentDate.setDate(currentDate.getDate() + d);
      
      for (let hour = 9; hour < 17; hour++) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, 0, 0, 0);

        // Check if slot is available (not in busy slots)
        const isSlotBusy = busySlots.some(busy => {
          if (!busy.start || !busy.end) return false;
          const busyStart = new Date(busy.start);
          const busyEnd = new Date(busy.end);
          return slotStart >= busyStart && slotStart < busyEnd;
        });

        if (!isSlotBusy) {
          availableSlots.push({
            date: slotStart.toISOString().split('T')[0],
            time: `${hour.toString().padStart(2, '0')}:00:00`,
          });
        }
      }
    }

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Calendar error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar availability' }, { status: 500 });
  }
}

// Create calendar event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, startTime, endTime, title, targetEmail, owner } = body;

    if (!date || !startTime || !endTime || !title || !targetEmail || !owner) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = {
      summary: title,
      start: {
        dateTime: `${date}T${startTime}`,
        timeZone: 'UTC',
      },
      end: {
        dateTime: `${date}T${endTime}`,
        timeZone: 'UTC',
      },
      attendees: [
        { email: targetEmail },
        { email: owner },
      ],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all',
    });

    return NextResponse.json({ success: true, eventId: response.data.id });
  } catch (error) {
    console.error('Calendar error:', error);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}