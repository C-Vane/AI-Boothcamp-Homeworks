"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectTargets } from "@/components/project/project-targets";
import { ProjectAgents } from "@/components/project/project-agents";
import { useProject } from "@/hooks/use-project";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { project, error, loading } = useProject(params.id);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <ProjectHeader project={project} />

      <Tabs defaultValue='targets' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='targets'>Targets</TabsTrigger>
          <TabsTrigger value='agents'>Agents</TabsTrigger>
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
