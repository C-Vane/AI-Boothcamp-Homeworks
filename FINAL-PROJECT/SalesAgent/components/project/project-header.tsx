"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ProjectWithRelations } from "@/hooks/use-project";

export function ProjectHeader({ project }: { project: ProjectWithRelations }) {
  const router = useRouter();

  return (
    <div className='flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-lg p-6'>
      <div className='space-y-1'>
        <h2 className='text-2xl font-semibold tracking-tight'>
          {project.name}
        </h2>
        <p className='text-sm text-muted-foreground'>
          {project.description || "No description"}
        </p>
      </div>
      <div className='flex items-center space-x-2'>
        <Button variant='outline' onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
