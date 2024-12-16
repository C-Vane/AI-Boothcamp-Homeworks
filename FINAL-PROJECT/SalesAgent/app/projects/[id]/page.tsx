"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectTargets } from "@/components/project/project-targets";
import { ProjectAgents } from "@/components/project/project-agents";
import { useProject } from "@/hooks/use-project";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { project, error, loading } = useProject(id);

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

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6 w-full max-w-7xl mx-auto'>
      <ProjectHeader project={project} />

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
          <ProjectTargets project={project} />
        </TabsContent>
        <TabsContent value='agents' className='space-y-4'>
          <ProjectAgents project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
