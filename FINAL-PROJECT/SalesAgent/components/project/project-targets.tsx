"use client";

import { IProject } from "@/models/Project";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NewTargetDialog } from "./new-target-dialog";
import { Badge } from "@/components/ui/badge";
import { ITarget } from "@/models";

interface ProjectTargetsProps {
  project: IProject & { targets: ITarget[] };
}

const statusColors = {
  pending: "bg-blue-500",
  contacted: "bg-purple-500",
  scheduled: "bg-yellow-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
};

export function ProjectTargets({ project }: ProjectTargetsProps) {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h3 className='text-lg font-medium'>Targets</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Target</Button>
          </DialogTrigger>
          <NewTargetDialog projectId={project._id.toString()} />
        </Dialog>
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
            {project.targets?.map((target, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{target.name}</TableCell>
                <TableCell>{target.company}</TableCell>
                <TableCell>{target.position}</TableCell>
                <TableCell>
                  <Badge className={statusColors[target.status]}>
                    {target.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {target.email}
                  <br />
                  {target.phone}
                </TableCell>
                <TableCell className='text-right'>
                  <Button variant='ghost' size='sm'>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
