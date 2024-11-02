import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, temperature } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    temperature: temperature,
    messages: [
      {
        role: "system",
        content: `
              You are a world class comedian. You are given a topic, tone, and type of joke. You need to tell a joke that is related to the topic, tone, and type of joke. The delivery should be punchy, creative and short. 
        `,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
