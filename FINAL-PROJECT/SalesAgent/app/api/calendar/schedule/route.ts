import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Target from "@/models/Target";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agentId,
      targetId,
      targetEmail,
      startTime,
      duration,
      title,
      description,
    } = body;

    if (!agentId || !targetId || !startTime || !duration || !title) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get target details
    const target = await Target.findById(targetId);
    if (!target) {
      return NextResponse.json({ error: "Target not found" }, { status: 404 });
    }

    // TODO: Implement calendar integration
    // This would typically involve:
    // 1. Get the user owner of the agent
    // 2. Getting the user's calendar credentials
    // 3. Creating a calendar event
    // 4. Sending an invitation to the target's email
    // 5. Updating the target's status to completed in the database

    //If the we receive the target email and it's valid and different from the target's email update db

    // For now, return mock data
    const meeting = {
      id: "mock-meeting-id",
      title,
      description,
      startTime,
      duration,
      attendees: [
        { email: target.email, name: target.name },
        // Add user's email here
      ],
    };

    console.log(targetEmail);

    // Update target status
    await Target.findByIdAndUpdate(targetId, {
      status: "scheduled",
      lastContact: new Date(),
    });

    return NextResponse.json({ meeting });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return NextResponse.json(
      { error: "Failed to schedule meeting" },
      { status: 500 }
    );
  }
}
