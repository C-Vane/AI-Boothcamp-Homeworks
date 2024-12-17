"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignHeader } from "@/components/campaign/campaign-header";
import { CampaignTargets } from "@/components/campaign/campaign-targets";
import { CampaignAgents } from "@/components/campaign/campaign-agents";
import { useCampaign } from "@/hooks/use-campaign";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const { campaign, error, loading } = useCampaign(id);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className='container mx-auto p-4 md:p-8 pt-6 max-w-7xl space-y-4 '>
        <Skeleton className='h-[100px] w-full rounded-xl' />
        <Skeleton className='h-[400px] w-full' />
      </div>
    );
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6 w-full max-w-7xl mx-auto'>
      <CampaignHeader campaign={campaign} />

      <Tabs
        defaultValue='targets'
        className='space-y-4 bg-slate/10 backdrop-blur-lg rounded-lg p-6'>
        <TabsList className='bg-gray-950/50'>
          <TabsTrigger
            value='targets'
            className='data-[state=active]:bg-gray-900 data-[state=active]:text-white'>
            Targets
          </TabsTrigger>
          <TabsTrigger
            value='agents'
            className='data-[state=active]:bg-gray-900 data-[state=active]:text-white'>
            Agents
          </TabsTrigger>
        </TabsList>
        <TabsContent value='targets' className='space-y-4'>
          <CampaignTargets campaign={campaign} />
        </TabsContent>
        <TabsContent value='agents' className='space-y-4'>
          <CampaignAgents campaign={campaign} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
