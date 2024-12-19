import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import User from "@/models/User";
import Agent from "@/models/Agent";
import Lead from "@/models/Lead";
import { getCalendar } from "@/lib/google";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const agentId = searchParams.get("agentId");
    const leadId = searchParams.get("leadId");
    const date = searchParams.get("date");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const title = searchParams.get("title");
    const description = searchParams.get("description");

    if (!agentId || !leadId || !date || !startTime || !endTime || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch agent and user details
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const user = await User.findById(agent.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch lead details
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Create calendar event
    const event = {
      summary: title,
      description,
      start: {
        dateTime: `${date}T${startTime}`,
        timeZone: "UTC",
      },
      end: {
        dateTime: `${date}T${endTime}`,
        timeZone: "UTC",
      },
      attendees: [{ email: user.email }, { email: lead.email }],
    };

    const calendar = await getCalendar(user._id);

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all",
    });

    return NextResponse.json({ success: true, eventId: response.data.id });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return NextResponse.json(
      { error: "Failed to schedule meeting" },
      { status: 500 }
    );
  }
}
