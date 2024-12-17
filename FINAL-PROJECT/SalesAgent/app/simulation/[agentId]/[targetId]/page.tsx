import { ConvAI } from "@/components/ConvAI";
import dbConnect from "@/lib/db/connect";
import Target from "@/models/Target";
import Agent from "@/models/Agent";
import { updateAgentPrompt } from "@/lib/prompts/agentPrompt";
import { initElevenLabsClient } from "@/lib/11labs";

interface SimulationProps {
  params: Promise<{
    agentId: string;
    targetId: string;
  }>;
}

export default async function SimulationPage({ params }: SimulationProps) {
  const { agentId, targetId } = await params;

  await dbConnect();
  const [target, agent] = await Promise.all([
    Target.findById(targetId),
    Agent.findOne({ agentId: agentId }),
  ]);

  if (!target || !agent) {
    return <div>Target or Agent not found</div>;
  }

  const client = initElevenLabsClient();
  const agentDetails = await client.conversationalAi.getAgent(agent.agentId);

  // Convert Mongoose documents to plain objects
  const plainTarget = JSON.parse(JSON.stringify(target));
  const plainAgent = JSON.parse(JSON.stringify(agent));

  // Update agent prompt with target context and personality
  const updatedAgent = {
    ...plainAgent,
    ...agentDetails,
    prompt: updateAgentPrompt(
      agentDetails.conversation_config.agent?.prompt?.prompt || "",
      plainTarget,
      plainAgent.personality
    ),
  };

  return <ConvAI agentId={agentId} target={plainTarget} agent={updatedAgent} />;
}
