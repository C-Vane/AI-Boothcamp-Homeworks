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
import { NewTargetDialog } from "./new-target-dialog";
import { Badge } from "@/components/ui/badge";
import { ProjectWithRelations } from "@/hooks/use-project";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
  pending: "border-cyan-700 text-cyan-700",
  contacted: "border-purple-500 text-purple-500",
  scheduled: "border-yellow-500 text-yellow-500",
  completed: "border-emerald-700 text-emerald-700",
  failed: "border-red-500 text-red-500",
};

export function ProjectTargets({ project }: { project: ProjectWithRelations }) {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h3 className='text-lg font-medium'>Targets</h3>

        <NewTargetDialog
          projectId={project._id}
          agents={project.agents || []}
        />
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
            {/* If no targets, show a message */}
            {!project.targets?.length && (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No targets found.
                </TableCell>
              </TableRow>
            )}
            {project.targets?.map((target, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{target.name}</TableCell>
                <TableCell>{target.company}</TableCell>
                <TableCell>{target.position}</TableCell>
                <TableCell>
                  <Badge
                    variant={"outline"}
                    className={cn("capitalize", statusColors[target.status])}>
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
                    <Button variant='ghost' size='icon'>
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive'>
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
