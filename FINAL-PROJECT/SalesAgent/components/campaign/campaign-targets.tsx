"use client";

import { Fragment, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewTargetDialog } from "./new-target-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TargetCalls } from "./target-calls";
import { CampaignWithRelations } from "@/hooks/use-campaign";
import { useCampaignTargets } from "@/hooks/use-campaign";
import { ITarget } from "@/models/Target";

const STATUS_OPTIONS = ["all", "scheduled", "contacted", "completed", "failed"];

interface CampaignTargetsProps {
  campaign: CampaignWithRelations;
}

const statusColors = {
  scheduled: "border-cyan-700 text-cyan-700",
  contacted: "border-purple-500 text-purple-500",
  completed: "border-green-500 text-green-500",
  failed: "border-red-500 text-red-500",
};

export function CampaignTargets({ campaign }: CampaignTargetsProps) {
  const {
    targets,
    pagination,
    isLoading,
    error,
    setPage,
    handleSearch,
    handleStatusFilter,
    search,
    status,
  } = useCampaignTargets(campaign._id);

  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  if (error) {
    return <div>Error loading targets: {error.message}</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h3 className='text-lg font-medium'>Targets</h3>
        <NewTargetDialog
          campaignId={campaign._id}
          agents={campaign.agents || []}
        />
      </div>

      <div className='flex gap-4'>
        <Input
          placeholder='Search by name or company...'
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className='max-w-sm'
        />
        <Select value={status} onValueChange={handleStatusFilter}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : !targets?.length ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No targets found.
                </TableCell>
              </TableRow>
            ) : (
              targets.map((target: ITarget) => (
                <Fragment key={target._id.toString()}>
                  <TableRow
                    onClick={() => setSelectedTargetId(target._id.toString())}
                    className='cursor-pointer'>
                    <TableCell className='font-medium'>{target.name}</TableCell>
                    <TableCell>{target.company}</TableCell>
                    <TableCell>{target.position}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn(
                          "capitalize",
                          statusColors[
                            target.status as keyof typeof statusColors
                          ]
                        )}>
                        {target.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {target.email}
                      <br />
                      {target.phone}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='ghost'
                          className='h-8 w-8 p-0'
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit
                          }}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          className='h-8 w-8 p-0'
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {selectedTargetId === target._id.toString() && (
                    <TableRow>
                      <TableCell colSpan={6} className='p-0'>
                        <TargetCalls
                          targetId={target._id.toString()}
                          campaignId={campaign._id.toString()}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex justify-center gap-2'>
        <Button
          variant='outline'
          onClick={() => setPage(pagination.page - 1)}
          disabled={pagination.page === 1 || isLoading}>
          Previous
        </Button>
        <span className='py-2'>
          Page {pagination.page} of {pagination.pages}
        </span>
        <Button
          variant='outline'
          onClick={() => setPage(pagination.page + 1)}
          disabled={pagination.page === pagination.pages || isLoading}>
          Next
        </Button>
      </div>
    </div>
  );
}
