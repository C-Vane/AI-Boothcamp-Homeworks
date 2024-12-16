import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Target from "@/models/Target";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const data = await req.json();
    const {
      name,
      company,
      position,
      industry,
      email,
      phone,
      contactInCommon,
      bestTimeToCall,
      timezone,
      lastContact,
      notes,
      agentId,
    } = data;

    const projectId = (await params).id;

    const target = await Target.create({
      name,
      company,
      position,
      industry,
      email,
      phone,
      contactInCommon,
      bestTimeToCall,
      timezone,
      lastContact,
      notes,
      projectId,
      agentId,
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Target created successfully",
      target,
    });
  } catch (error) {
    console.error("Error creating target:", error);
    return NextResponse.json(
      { error: "Failed to create target" },
      { status: 500 }
    );
  }
}
