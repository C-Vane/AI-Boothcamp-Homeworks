"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NewTargetDialogProps {
  projectId: string;
}

export function NewTargetDialog({ projectId }: NewTargetDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      company: formData.get("company"),
      position: formData.get("position"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes"),
    };

    try {
      const response = await fetch(`/api/projects/${projectId}/targets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create target");
      }

      toast({
        title: "Success",
        description: "Target created successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create target",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Target</DialogTitle>
        <DialogDescription>
          Add a new target to your project. Fill in the details below.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' name='name' className='col-span-3' required />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='company' className='text-right'>
              Company
            </Label>
            <Input id='company' name='company' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='position' className='text-right'>
              Position
            </Label>
            <Input id='position' name='position' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='phone' className='text-right'>
              Phone
            </Label>
            <Input id='phone' name='phone' type='tel' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='notes' className='text-right'>
              Notes
            </Label>
            <Input id='notes' name='notes' className='col-span-3' />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' disabled={loading}>
            {loading ? "Adding..." : "Add Target"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
