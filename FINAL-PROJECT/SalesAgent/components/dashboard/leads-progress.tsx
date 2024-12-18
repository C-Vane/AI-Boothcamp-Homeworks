"use client";

import { Progress } from "@/components/ui/progress";

interface LeadsProgressProps {
  progress?: {
    name: string;
    progress: number;
    total: number;
    completed: number;
  }[];
}

export function LeadsProgress({ progress }: LeadsProgressProps) {
  if (!progress) return null;

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-gray-100'>Leads Progress</h3>
      <div className='space-y-8'>
        {progress.map(
          (lead) =>
            lead.name && (
              <div key={lead.name} className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-200'>{lead.name}</span>
                  <span className='text-gray-200'>
                    {lead.completed}/{lead.total}
                  </span>
                </div>
                <Progress value={lead.progress} className='h-2' />
              </div>
            )
        )}
      </div>
    </div>
  );
}
