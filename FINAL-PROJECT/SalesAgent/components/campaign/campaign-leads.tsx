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
import { NewLeadDialog } from "./new-lead-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeadCalls } from "./lead-calls";
import { CampaignWithRelations } from "@/hooks/use-campaign";
import { useCampaignLeads } from "@/hooks/use-campaign";
import { ILead, LeadsEnum } from "@/models/Lead";

interface CampaignLeadsProps {
  campaign: CampaignWithRelations;
}

const statusColors: Record<LeadsEnum, string> = {
  new: "border-gray-500 text-gray-500",
  scheduled: "border-cyan-700 text-cyan-700",
  contacted: "border-purple-500 text-purple-500",
  closed: "border-green-500 text-green-500",
  failed: "border-red-500 text-red-500",
  responded: "border-amber-500 text-amber-500",
};

export function CampaignLeads({ campaign }: CampaignLeadsProps) {
  const {
    leads,
    pagination,
    isLoading,
    error,
    setPage,
    handleSearch,
    handleStatusFilter,
    search,
    status,
  } = useCampaignLeads(campaign._id);

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  if (error) {
    return <div>Error loading leads: {error.message}</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h3 className='text-lg font-medium'>Leads</h3>
        <NewLeadDialog
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
            {Object.values(LeadsEnum).map((statusOption) => (
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
            ) : !leads?.length ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead: ILead) => (
                <Fragment key={lead._id.toString()}>
                  <TableRow
                    onClick={() =>
                      selectedLeadId === lead._id.toString()
                        ? setSelectedLeadId(null)
                        : setSelectedLeadId(lead._id.toString())
                    }
                    className='cursor-pointer'>
                    <TableCell className='font-medium'>{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.position}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn(
                          "capitalize",
                          statusColors[lead.status as keyof typeof statusColors]
                        )}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.email}
                      <br />
                      {lead.phone}
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
                  {selectedLeadId === lead._id.toString() && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='p-4 bg-slate-50 dark:bg-slate-900'>
                        <LeadCalls
                          leadId={lead._id.toString()}
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
