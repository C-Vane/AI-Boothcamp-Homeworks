import { PromptAgentToolsItem } from "elevenlabs/api";

export const calendarTools: PromptAgentToolsItem[] = [
  {
    type: "webhook",
    name: "get_user_availability",
    description: "Get the available time slots for a user by their ID",
    api_schema: {
      method: "GET",
      url: "https://sales-agent-sigma.vercel.app/api/calendar/availability",
      query_params_schema: {
        properties: {
          agentId: {
            type: "string",
            description: "The Id of the agent who is scheduling the meeting",
          },
          startDate: {
            type: "string",
            description: "Start date in ISO format (YYYY-MM-DD)",
          },
          endDate: {
            type: "string",
            description: "End date in ISO format (YYYY-MM-DD)",
          },
        },
        required: ["agentId", "startDate", "endDate"],
      },
    },
  },
  {
    type: "webhook",
    name: "schedule_meeting",
    description: "Schedule a meeting with a lead on the user's calendar",
    api_schema: {
      method: "POST",
      url: "https://sales-agent-sigma.vercel.app/api/calendar/schedule",
      request_headers: {
        "Content-Type": "application/json",
        secret: {
          secret_id: "secret_id",
        },
      },
      request_body_schema: {
        type: "object",
        properties: {
          agentId: {
            type: "string",
            description: "The ID of the agent who is scheduling the meeting",
          },
          leadId: {
            type: "string",
            description: "The ID of the lead to schedule the meeting with",
          },
          leadEmail: {
            type: "string",
            description: "The email of the lead to schedule the meeting with",
          },
          startTime: {
            type: "string",
            description:
              "Meeting start time in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
          },
          duration: {
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
        required: ["agentId", "leadId", "startTime", "duration", "title"],
      },
    },
  },
];
