"use client";

import { IProject } from "@/models/Project";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NewAgentDialog } from "./new-agent-dialog";
import { FileUploadDialog } from "./file-upload-dialog";
import { useState } from "react";
import { deleteAgent, deleteDocument, getDocuments } from "@/lib/11labs";
import { useToast } from "@/hooks/use-toast";

interface ProjectAgentsProps {
  project: IProject;
}

export function ProjectAgents({ project }: ProjectAgentsProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await deleteAgent(agentId);
      // Update project in database to remove agent
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h3 className='text-lg font-medium'>AI Sales Agents</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Agent</Button>
          </DialogTrigger>
          <NewAgentDialog projectId={project._id.toString()} />
        </Dialog>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {project.agents?.map((agent) => (
          <Card key={agent.agentId}>
            <CardHeader>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Created: {new Date(agent.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    onClick={() => setSelectedAgentId(agent.agentId)}>
                    Add Resources
                  </Button>
                </DialogTrigger>
                <FileUploadDialog
                  agentId={agent.agentId}
                  projectId={project._id.toString()}
                />
              </Dialog>
              <Button
                variant='destructive'
                onClick={() => handleDeleteAgent(agent.agentId)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
