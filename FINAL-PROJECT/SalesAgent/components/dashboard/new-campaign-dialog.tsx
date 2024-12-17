"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
];

export function NewCampaignDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      industry: formData.get("industry"),
      logoUrl: formData.get("logoUrl"),
    };

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
      setOpen(false);
      // You might want to refresh the campaigns list here
    } catch {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Campaign</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Create a new campaign to manage your sales targets and agents.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' name='name' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea id='description' name='description' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='industry'>Industry</Label>
            <Select name='industry'>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select an industry' />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='logoUrl'>Logo URL</Label>
            <Input
              id='logoUrl'
              name='logoUrl'
              placeholder='https://example.com/logo.png'
            />
          </div>
          <DialogFooter>
            <Button type='submit' className='w-full'>
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
