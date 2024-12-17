import { NextRequest, NextResponse } from "next/server";
import Call from "@/models/Call";
import dbConnect from "@/lib/db/connect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { initElevenLabsClient } from "@/lib/11labs";
import { Target } from "@/models";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, agentId, targetId } = await req.json();

    await dbConnect();

    const call = await Call.create({
      conversationId,
      agentId,
      targetId,
      startTime: new Date(),
      status: "scheduled",
    });

    return NextResponse.json(call);
  } catch (error) {
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await req.json();

    await dbConnect();

    // Get the call from database
    const call = await Call.findOne({ conversationId });
    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    // Get conversation transcript from ElevenLabs
    const elevenLabs = initElevenLabsClient();
    const conversation = await elevenLabs.conversationalAi.getConversation(
      conversationId
    );

    // Format transcript for OpenAI
    const transcript = conversation.transcript.map(
      ({ role, message, time_in_call_secs }) => ({
        timestamp: new Date(
          conversation.metadata.start_time_unix_secs + time_in_call_secs
        ),
        speaker: role,
        text: message,
      })
    );

    // Generate summary using OpenAI
    const summaryCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sales call analyzer. Create a concise summary of the following sales call transcript.",
        },
        {
          role: "user",
          content: JSON.stringify(transcript),
        },
      ],
    });

    const todoItemsSchema = z.object({
      todo_items: z.array(
        z.object({
          task: z.string(),
        })
      ),
    });

    // Generate action items using OpenAI
    const todoCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sales call analyzer. Generate a list of action items based on the following sales call transcript. Each action item should have a title, description, and priority (high, medium, low).",
        },
        {
          role: "user",
          content: JSON.stringify(transcript),
        },
      ],
      response_format: zodResponseFormat(todoItemsSchema, "todo_items"),
    });

    // Get the status of the call if completed form the summery
    const statusCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sales call analyzer. Analyze the following sales call transcript and determine the goal was completed or not.",
        },
        {
          role: "user",
          content: JSON.stringify(transcript),
        },
      ],
      response_format: zodResponseFormat(
        z.enum(["completed", "failed"]),
        "status"
      ),
    });

    const status = statusCompletion.choices[0].message.content
      ? JSON.parse(statusCompletion.choices[0].message.content).status
      : "contacted";

    // Update call with all information
    const endTime = new Date();
    const duration = endTime.getTime() - call.startTime.getTime();

    const todoItems = todoCompletion.choices[0].message.content
      ? JSON.parse(todoCompletion.choices[0].message.content).todo_items
      : [];

    const summary = summaryCompletion.choices[0].message.content || "";

    const updatedCall = await Call.findOneAndUpdate(
      { conversationId },
      {
        endTime,
        duration,
        transcript,
        summary,
        todoItems,
        status: "completed",
      },
      { new: true }
    );

    //update target last contact date
    await Target.findByIdAndUpdate(call.targetId, {
      lastContact: new Date(),
      status,
    });

    return NextResponse.json(updatedCall);
  } catch (error) {
    console.error("Error updating call:", error);
    return NextResponse.json(
      { error: "Failed to update call" },
      { status: 500 }
    );
  }
}
