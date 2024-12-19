import { User } from "@/models";
import { calendar_v3, google } from "googleapis";
import { ObjectId } from "mongoose";

let calendar: calendar_v3.Calendar;

export const getCalendar = async (userId: ObjectId) => {
  if (calendar) {
    return calendar;
  }

  const user = await User.findById(userId);
  if (!user || !user.googleCalendarConnected) {
    throw new Error("User not found or not connected to Google");
  }

  const access_token = user.googleAccessToken;
  if (!access_token) {
    throw new Error("Google access token not found");
  }

  const refresh_token = user.googleRefreshToken;
  if (!refresh_token) {
    throw new Error("Google refresh token not found");
  }

  const oauth2Client = getOauth2Client();

  // const { tokens } = await oauth2Client.getToken(refresh_token);

  // console.log(tokens);

  // if (!tokens || !tokens.access_token || !tokens.refresh_token) {
  //   throw new Error("Google access token or refresh token not found");
  // }
  // Configure Google Calendar

  oauth2Client.setCredentials({ access_token: access_token });

  calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // await User.findByIdAndUpdate(userId, {
  //   googleAccessToken: tokens.access_token,
  //   googleRefreshToken: tokens.refresh_token,
  // });

  return calendar;
};

export function getOauth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  return oauth2Client;
}
