import { PromptAgentToolsItem } from "elevenlabs/api";

export const calendarTools: PromptAgentToolsItem[] = [
  {
    type: "client",
    name: "getUserAvailability",
    description: "Get the available time slots",
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date in ISO format (YYYY-MM-DD)",
        },
        endDate: {
          type: "string",
          description: "End date in ISO format (YYYY-MM-DD)",
        },
      },
      required: ["startDate", "endDate"],
    },
    expects_response: true,
  },
  {
    type: "client",
    name: "scheduleMeeting",
    description:
      "Send the meeting details and schedule a meeting with the lead",
    parameters: {
      properties: {
        leadId: {
          type: "string",
          description: "The ID of the lead to schedule the meeting with",
        },
        leadEmail: {
          type: "string",
          description: "The email of the lead to schedule the meeting with",
        },
        date: {
          type: "string",
          description: "The date of the meeting in ISO format (YYYY-MM-DD)",
        },
        startTime: {
          type: "string",
          description:
            "Meeting start time in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
        },
        endTime: {
          type: "number",
          description: "Duration of the meeting in minutes",
        },
        title: {
          type: "string",
          description: "Title of the meeting",
        },
        description: {
          type: "string",
          description: "Description of the meeting",
        },
      },
      required: ["date", "leadId", "startTime", "endTime", "title"],
    },
    expects_response: true,
  },
  {
    type: "client",
    name: "endCall",
    description: "End the current call",
  },
];
