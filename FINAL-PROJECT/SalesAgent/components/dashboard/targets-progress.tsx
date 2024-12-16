"use client";

import { Progress } from "@/components/ui/progress";

interface TargetsProgressProps {
  progress?: {
    name: string;
    progress: number;
    total: number;
    completed: number;
  }[];
}

export function TargetsProgress({ progress }: TargetsProgressProps) {
  if (!progress) return null;

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-gray-100'>Targets Progress</h3>
      <div className='space-y-8'>
        {progress.map(
          (target) =>
            target.name && (
              <div key={target.name} className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-200'>{target.name}</span>
                  <span className='text-gray-200'>
                    {target.completed}/{target.total}
                  </span>
                </div>
                <Progress value={target.progress} className='h-2' />
              </div>
            )
        )}
      </div>
    </div>
  );
}
