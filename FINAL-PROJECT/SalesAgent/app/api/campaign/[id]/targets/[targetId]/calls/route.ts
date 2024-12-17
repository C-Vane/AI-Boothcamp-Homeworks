import { NextRequest, NextResponse } from "next/server";
import Call from "@/models/Call";
import dbConnect from "@/lib/db/connect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ targetId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const calls = await Call.find({ targetId: (await params).targetId })
      .sort({ startTime: -1 })
      .lean();

    console.log(calls);

    return NextResponse.json(calls);
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
