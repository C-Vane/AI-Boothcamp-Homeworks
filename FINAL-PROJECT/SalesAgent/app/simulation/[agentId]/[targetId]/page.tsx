import { ConvAI } from "@/components/ConvAI";
import dbConnect from "@/lib/db/connect";
import Target from "@/models/Target";

interface SimulationProps {
  params: Promise<{
    agentId: string;
    targetId: string;
  }>;
}

export default async function SimulationPage({ params }: SimulationProps) {
  const { agentId, targetId } = await params;

  await dbConnect();
  const target = await Target.findById(targetId);

  if (!target) {
    return <div>Target not found</div>;
  }

  // Convert Mongoose document to plain object
  const plainTarget = JSON.parse(JSON.stringify(target));

  return <ConvAI agentId={agentId} target={plainTarget} />;
}
