import { ConvAI } from "@/components/ConvAI";

interface SimulationProps {
  params: {
    agentId: string;
  };
}

export default async function SimulationPage({ params }: SimulationProps) {
  const { agentId } = await params;
  return (
    <div>
      <ConvAI agentId={agentId} />
    </div>
  );
}
