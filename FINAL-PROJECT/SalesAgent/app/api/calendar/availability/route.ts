import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import User from "@/models/User";
import { getCalendar } from "@/lib/google";
import { Campaign } from "@/models";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!campaignId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch agent and user details
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

    const calendar = await getCalendar(user._id);

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

        const isSlotBusy = busySlots.some((busy) => {
          if (!busy.start || !busy.end) return false;
          const busyStart = new Date(busy.start);
          const busyEnd = new Date(busy.end);
          return slotStart >= busyStart && slotStart < busyEnd;
        });

        if (!isSlotBusy) {
          availableSlots.push({
            date: slotStart.toISOString().split("T")[0],
            time: `${hour.toString().padStart(2, "0")}:00:00`,
          });
        }
      }
    }

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
