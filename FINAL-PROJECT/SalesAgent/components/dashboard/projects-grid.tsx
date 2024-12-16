"use client";

import { Phone, BarChart, Users } from "lucide-react";
import { NewProjectDialog } from "./new-project-dialog";
import Link from "next/link";
import { Project } from "@/hooks/us-dashboard-data";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold text-gray-100'>Active Projects</h3>

        <NewProjectDialog />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects?.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className='block group'>
            <div className='bg-white/5 backdrop-blur-lg rounded-lg p-6 space-y-4 hover:bg-slate/10 transition-colors duration-200'>
              <h4 className='text-lg font-medium text-gray-100'>
                {project.name}
              </h4>

              <div className='grid grid-cols-3 gap-4'>
                <Stat
                  icon={<Users className='w-4 h-4' />}
                  label='Targets'
                  value={project.targets}
                />
                <Stat
                  icon={<Phone className='w-4 h-4' />}
                  label='Calls'
                  value={project.calls}
                />
                <Stat
                  icon={<BarChart className='w-4 h-4' />}
                  label='Conv.'
                  value={project.conversion}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className='flex flex-col items-center space-y-1'>
      <div className='text-gray-400'>{icon}</div>
      <span className='text-xs text-gray-400'>{label}</span>
      <span className='text-sm font-medium text-gray-200'>{value}</span>
    </div>
  );
}
