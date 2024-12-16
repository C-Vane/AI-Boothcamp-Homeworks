import { ElevenLabsClient } from "elevenlabs";

const XI_API_KEY = process.env.XI_API_KEY;

export let client: ElevenLabsClient;

export const initElevenLabsClient = () => {
  if (!XI_API_KEY) {
    throw new Error("Missing XI_API_KEY in environment variables");
  }
  if (client) {
    return client;
  }
  client = new ElevenLabsClient({ apiKey: XI_API_KEY });

  if (!client) {
    throw new Error("Failed to initialize ElevenLabsClient");
  }

  return client;
};
