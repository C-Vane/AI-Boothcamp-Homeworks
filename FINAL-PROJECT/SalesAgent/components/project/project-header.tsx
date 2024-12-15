"use client";

import { IProject } from "@/models/Project";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ProjectHeaderProps {
  project: IProject;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const router = useRouter();

  return (
    <div className='flex items-center justify-between'>
      <div className='space-y-1'>
        <h2 className='text-2xl font-semibold tracking-tight'>
          {project.name}
        </h2>
        <p className='text-sm text-muted-foreground'>
          {project.description || "No description"}
        </p>
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
