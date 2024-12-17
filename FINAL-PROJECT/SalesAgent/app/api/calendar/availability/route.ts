import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/db/connect";
import User from "@/models/User";
import Agent from "@/models/Agent";

// Configure Google Calendar
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/callback/google'
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!agentId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    await dbConnect();

    // Fetch agent and user details
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const user = await User.findById(agent.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch calendar events
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: new Date(startDate).toISOString(),
        timeMax: new Date(endDate).toISOString(),
        items: [{ id: user.email }],
      },
    });

    // Process busy times to find available slots
    const busySlots = response.data.calendars?.[user.email]?.busy || [];
    const availableSlots = [];

    // Generate available slots (9 AM to 5 PM, 1-hour slots)
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      for (let hour = 9; hour < 17; hour++) {
        const slotStart = new Date(d);
        slotStart.setHours(hour, 0, 0, 0);

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

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
