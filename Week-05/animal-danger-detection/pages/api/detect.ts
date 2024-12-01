// pages/api/detect.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Input = {
  content: string;
  animal: string;
  score: number;
};

type Output = {
  error?: string;
  response?: string;
};

async function fetchWikipediaInfo(animal: string) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        animal,
      )}`,
    );
    const data = await response.json();
    return data.extract || "No information found.";
  } catch (error) {
    console.log("Error fetching from Wikipedia:", error);
    return "Error fetching information.";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { animal, score }: Input = req.body;

    // Fetch information about the animal from Wikipedia
    const wikipediaInfo = await fetchWikipediaInfo(animal);

    // Create a prompt for the LLM to analyze the danger level
    const prompt = `Based on the following information about a ${animal}, determine if it's dangerous to humans. Consider factors like size, behavior, habitat, and historical interactions with humans.

Information about the ${animal}:
${wikipediaInfo}

Model confidence in identification of the animal: ${(score * 100).toFixed(2)}%

Please provide:
- A clear yes/no assessment of whether the animal is dangerous
- A brief explanation of why
- Any safety precautions if applicable

Format your response in a conversational, informative way.`;

    // Get analysis from OpenAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 300,
    });

    const response =
      completion.choices[0]?.message?.content || "No response generated.";

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in danger detection:", error);
    res.status(500).json({ error: "Error processing request" });
  }
}
