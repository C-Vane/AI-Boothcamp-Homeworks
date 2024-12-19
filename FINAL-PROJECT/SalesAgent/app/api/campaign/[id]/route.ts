import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Agent, Campaign, Lead } from "@/models";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { initElevenLabsClient } from "@/lib/11labs";
import { authOptions } from "../../auth/[...nextauth]/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, description, industry, logo } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create new campaign
    const campaign = await Campaign.create({
      name,
      description,
      industry,
      logo,
      adminId: new mongoose.Types.ObjectId(session.user.id),
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Campaign creation error:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const campaignId = (await params).id;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const client = initElevenLabsClient();

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    //get campaign with agents and leads
    const campaign = await Campaign.findById(campaignId);

    const agentIds = await Agent.find({ campaignId: campaignId });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Get agent details from 11Labs
    const agents = await Promise.all(
      agentIds.map(async (agent: { agentId: string }) => {
        const agentDetails = await client.conversationalAi.getAgent(
          agent.agentId
        );
        return {
          agentId: agent.agentId,
          ...agentDetails,
        };
      })
    );

    const leads = await Lead.find({ campaignId: campaignId });

    return NextResponse.json({ ...campaign.toObject(), agents, leads });
  } catch (error) {
    console.error("Campaign creation error:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
