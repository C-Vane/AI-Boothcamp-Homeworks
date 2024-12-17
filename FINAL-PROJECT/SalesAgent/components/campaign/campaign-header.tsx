"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CampaignWithRelations } from "@/hooks/use-campaign";

export function CampaignHeader({
  campaign,
}: {
  campaign: CampaignWithRelations;
}) {
  const router = useRouter();

  return (
    <div className='flex items-center justify-between bg-slate/10 backdrop-blur-lg rounded-lg p-6'>
      <div className='space-y-1'>
        <h2 className='text-2xl font-semibold tracking-tight'>
          {campaign.name}
        </h2>
        <p className='text-sm text-muted-foreground'>
          {campaign.description || "No description"}
        </p>
      </div>
      <div className='flex items-center space-x-2'>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
