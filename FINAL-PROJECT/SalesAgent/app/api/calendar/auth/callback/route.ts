import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getOauth2Client } from "@/lib/google";
import User from "@/models/User";
import dbConnect from "@/lib/db/connect";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.redirect(
        new URL("/dashboard?error=unauthorized", req.url)
      );
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL("/dashboard?error=no-code", req.url)
      );
    }

    const oauth2Client = getOauth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    // Update user with Google Calendar credentials
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleCalendarConnected: true,
      }
    );

    // Redirect back to the dashboard with success message
    return NextResponse.redirect(
      new URL("/dashboard?success=calendar-connected", req.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/dashboard?error=google-auth-failed", req.url)
    );
  }
}
