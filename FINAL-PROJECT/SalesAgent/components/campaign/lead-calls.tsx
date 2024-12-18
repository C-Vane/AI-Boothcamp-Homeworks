import { useEffect, useState } from "react";
import { ICall } from "@/models/Call";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CallDetailsDialog } from "./call-details-dialog";

interface LeadCallsProps {
  campaignId: string;
  leadId: string;
}

const statusColors = {
  completed: "bg-emerald-700 hover:bg-emerald-800",
  failed: "bg-red-700 hover:bg-red-800",
  scheduled: "bg-amber-700 hover:bg-amber-800",
  started: "bg-cyan-700 hover:bg-cyan-800",
};

export function LeadCalls({ campaignId, leadId }: LeadCallsProps) {
  const [calls, setCalls] = useState<ICall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const response = await fetch(
          `/api/campaign/${campaignId}/leads/${leadId}/calls`
        );
        if (!response.ok) throw new Error("Failed to fetch calls");
        const data = await response.json();
        setCalls(data);
      } catch (error) {
        console.error("Error fetching calls:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCalls();
  }, [campaignId, leadId]);

  if (loading) {
    return <div>Loading calls...</div>;
  }

  if (calls.length === 0) {
    return <div>No calls found for this lead.</div>;
  }

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Call History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action Items</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.conversationId}>
              <TableCell>{format(new Date(call.startTime), "PPp")}</TableCell>
              <TableCell>
                {call.duration
                  ? `${Math.round(call.duration / 1000 / 60)} minutes`
                  : "-"}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[call.status]}>
                  {call.status}
                </Badge>
              </TableCell>
              <TableCell>
                {call.todoItems?.length || 0} items (
                {call.todoItems?.filter((item) => item.status === "completed")
                  .length || 0}{" "}
                completed)
              </TableCell>
              <TableCell className='text-right'>
                <CallDetailsDialog call={call} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
