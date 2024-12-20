import { NextRequest, NextResponse } from "next/server";

import Agent from "@/models/Agent";

import { BodyCreateAgentV1ConvaiAgentsCreatePost, Llm } from "elevenlabs/api";
import { initElevenLabsClient } from "@/lib/11labs";
import dbConnect from "@/lib/db/connect";
import { calendarTools } from "@/types/tools";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const client = initElevenLabsClient();

    const campaignId = (await params).id;

    const formData = await req.formData();

    const data: BodyCreateAgentV1ConvaiAgentsCreatePost = {
      name: String(formData.get("name")) || "Agent",
      conversation_config: {
        agent: {
          prompt: {
            prompt: String(formData.get("prompt")),
            llm: String(formData.get("model")) as Llm,
            temperature: 0.5,
            max_tokens: 300,
            tools: calendarTools,
            knowledge_base: undefined,
            custom_llm: undefined,
          },
          first_message: String(formData.get("firstMessage")),
          language: String(formData.get("language")),
        },
        asr: undefined,
        turn: {
          turn_timeout: 3,
        },
        tts: {
          model_id: undefined,
          voice_id: String(formData.get("voice")),
        },
        conversation: {
          max_duration_seconds: 3000,
          client_events: undefined,
        },
      },
      platform_settings: {
        overrides: {
          conversation_config_override: {
            agent: {
              prompt: {
                prompt: true,
              },
              language: true,
            },
          },
        },
      },
    };

    // Create agent in ElevenLabs
    const newAgent = await client.conversationalAi.createAgent(data);

    // Process documents
    const documents = formData.getAll("documents");
    const resources: string[] = [];

    try {
      // Upload files
      for (const document of documents) {
        const result = await client.conversationalAi.addToAgentKnowledgeBase(
          newAgent.agent_id,
          {
            file: document as File,
          }
        );
        resources.push(result.id);
      }

      // Process links
      const links = String(formData.get("links")).split(" ").filter(Boolean);
      for (const link of links) {
        const result = await client.conversationalAi.addToAgentKnowledgeBase(
          newAgent.agent_id,
          {
            url: link,
          }
        );
        resources.push(result.id);
      }
    } catch (error) {
      console.error("Error processing documents:", error);
    }

    // Create agent record in database
    const agent = await Agent.create({
      agentId: newAgent.agent_id,
      campaignId,
      resources,
      tools: calendarTools,
    });

    return NextResponse.json({ agent, resources });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const client = initElevenLabsClient();
    const campaignId = (await params).id;

    const agents = await Agent.find({ campaignId });

    // Fetch full agent details from ElevenLabs
    const agentDetails = await Promise.all(
      agents
        .map(async (agent) => {
          const details = await client.conversationalAi.getAgent(agent.agentId);
          if (details) {
            return {
              ...details,
              ...agent.toObject(),
            };
          }
        })
        .filter(Boolean)
    );

    return NextResponse.json(agentDetails);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { agentId } = await req.json();
    const campaignId = (await params).id;

    await dbConnect();
    const client = initElevenLabsClient();

    // Delete from ElevenLabs
    await client.conversationalAi.deleteAgent(agentId);

    // Delete from database
    await Agent.deleteOne({ agentId, campaignId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
