import { ConvAI } from "@/components/ConvAI";
import dbConnect from "@/lib/db/connect";
import Lead from "@/models/Lead";
import Agent from "@/models/Agent";
import { updateAgentPrompt } from "@/lib/prompts/agentPrompt";
import { initElevenLabsClient } from "@/lib/11labs";

interface SimulationProps {
  params: Promise<{
    agentId: string;
    leadId: string;
  }>;
}

export default async function SimulationPage({ params }: SimulationProps) {
  const { agentId, leadId } = await params;

  await dbConnect();
  const [lead, agent] = await Promise.all([
    Lead.findById(leadId),
    Agent.findOne({ agentId: agentId }),
  ]);

  if (!lead || !agent) {
    return <div>Lead or Agent not found</div>;
  }

  const client = initElevenLabsClient();
  const agentDetails = await client.conversationalAi.getAgent(agent.agentId);

  // Convert Mongoose documents to plain objects
  const plainLead = JSON.parse(JSON.stringify(lead));
  const plainAgent = JSON.parse(JSON.stringify(agent));

  // Update agent prompt with lead context and personality
  const updatedAgent = {
    ...plainAgent,
    ...agentDetails,
    prompt: updateAgentPrompt(
      agentDetails.conversation_config.agent?.prompt?.prompt || "",
      plainLead,
      plainAgent.personality
    ),
  };

  return <ConvAI agentId={agentId} lead={plainLead} agent={updatedAgent} />;
}
