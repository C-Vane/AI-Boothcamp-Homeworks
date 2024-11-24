import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
      { status: 500 },
    );
  }
}
