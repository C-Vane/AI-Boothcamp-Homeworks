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
import { Textarea } from "@/components/ui/textarea";

import { addDocument } from "@/lib/11labs";
import { useToast } from "@/hooks/use-toast";

interface FileUploadDialogProps {
  agentId: string;
  projectId: string;
}

export function FileUploadDialog({ agentId }: FileUploadDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      await addDocument(agentId, file, name, description);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Resources</DialogTitle>
        <DialogDescription>
          Upload documents to enhance your AI agent&apos;s knowledge base.
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
            <Label htmlFor='description' className='text-right'>
              Description
            </Label>
            <Textarea
              id='description'
              name='description'
              className='col-span-3'
              placeholder='Describe the contents of this document...'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='file' className='text-right'>
              File
            </Label>
            <Input
              id='file'
              name='file'
              type='file'
              className='col-span-3'
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' disabled={loading || !file}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
