import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Target, { ITarget } from "@/models/Target";
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
      campaignId,
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

    const query: RootFilterQuery<ITarget> = {
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
    const total = await Target.countDocuments(query);

    // Get paginated results
    const targets: ITarget[] = await Target.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      targets,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching targets:", error);
    return NextResponse.json(
      { error: "Failed to fetch targets" },
      { status: 500 }
    );
  }
}
