import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { initElevenLabsClient } from "@/lib/11labs";

export async function GET() {
  try {
    const client = initElevenLabsClient();

    const voices = await client.voices.getAll();

    return NextResponse.json(voices);
  } catch (error) {
    console.error("Error fetching voices:", error);
    return NextResponse.json(
      { error: "Failed to fetch voices" },
      { status: 500 }
    );
  }
}
