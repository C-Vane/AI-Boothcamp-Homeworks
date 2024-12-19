import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import User from "@/models/User";
import Lead from "@/models/Lead";
import { getCalendar } from "@/lib/google";
import { Campaign } from "@/models";

export async function POST(req: NextRequest) {
  try {
    const { campaignId, leadId, startTime, endTime, title, description } =
      await req.json();

    if (!campaignId || !leadId || !startTime || !endTime || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch campaign and user details
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(campaign.adminId);
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
        dateTime: startTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: endTime,
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
