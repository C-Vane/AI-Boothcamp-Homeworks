import { NextResponse } from "next/server";
import { getOauth2Client } from "@/lib/google";

export async function GET() {
  try {
    const oauth2Client = getOauth2Client();

    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
