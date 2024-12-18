import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Lead, { ILead } from "@/models/Lead";
import { RootFilterQuery } from "mongoose";

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

    const campaignId = (await params).id;

    const lead = await Lead.create({
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
      campaignId,
      agentId,
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = (await params).id;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    await dbConnect();

    const query: RootFilterQuery<ILead> = {
      campaignId: campaignId,
    };

    if (status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const total = await Lead.countDocuments(query);

    // Get paginated results
    const leads: ILead[] = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      leads,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
