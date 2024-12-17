import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/db/connect";
import User from "@/models/User";
import Agent from "@/models/Agent";
import Target from "@/models/Target";

// Configure Google Calendar
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/callback/google'
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, targetId, date, startTime, endTime, title, description } = body;

    if (!agentId || !targetId || !date || !startTime || !endTime || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    // Fetch target details
    const target = await Target.findById(targetId);
    if (!target) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 });
    }

    // Create calendar event
    const event = {
      summary: title,
      description,
      start: {
        dateTime: `${date}T${startTime}`,
        timeZone: 'UTC',
      },
      end: {
        dateTime: `${date}T${endTime}`,
        timeZone: 'UTC',
      },
      attendees: [
        { email: user.email },
        { email: target.email },
      ],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all',
    });

    return NextResponse.json({ success: true, eventId: response.data.id });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return NextResponse.json({ error: 'Failed to schedule meeting' }, { status: 500 });
  }
}
