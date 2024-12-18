"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { NewAgentDialog } from "./new-agent-dialog";

import { useToast } from "@/hooks/use-toast";
import { CampaignWithRelations } from "@/hooks/use-campaign";
import { client } from "@/lib/11labs";
import { Pencil, Play, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function CampaignAgents({
  campaign,
}: {
  campaign: CampaignWithRelations;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await client.conversationalAi.deleteAgent(agentId);
      // Update campaign in database to remove agent
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
        <NewAgentDialog campaignId={campaign._id} />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Voice</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!campaign.agents?.length && (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No agents found.
                </TableCell>
              </TableRow>
            )}
            {campaign.agents?.map((agent) => (
              <TableRow key={agent.agent_id}>
                <TableCell className='font-medium'>
                  <div>
                    <div>{agent.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {agent.conversation_config.agent?.prompt?.prompt}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {agent.conversation_config.agent?.language}
                </TableCell>
                <TableCell>
                  {agent.conversation_config.agent?.prompt?.llm}
                </TableCell>
                <TableCell>{agent.conversation_config.tts?.voice_id}</TableCell>
                <TableCell>
                  {new Date(
                    agent.metadata.created_at_unix_secs * 1000
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <Play className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='end'
                        className='max-h-36 overflow-scroll'>
                        {campaign.leads?.map((lead) => (
                          <DropdownMenuItem
                            key={lead._id.toString()}
                            onClick={() =>
                              router.push(
                                `/simulation/${agent.agent_id}/${lead._id}`
                              )
                            }>
                            {lead.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant='ghost' size='icon'>
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive'
                      onClick={() => handleDeleteAgent(agent.agent_id)}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
