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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

interface NewTargetDialogProps {
  projectId: string;
  agents: Array<{
    agent_id: string;
    name: string;
  }>;
}

const timeZones = Intl.supportedValuesOf("timeZone");

export function NewTargetDialog({ projectId, agents }: NewTargetDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      company: formData.get("company"),
      position: formData.get("position"),
      industry: formData.get("industry"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      contactInCommon: formData.get("contactInCommon"),
      bestTimeToCall: formData.get("bestTimeToCall"),
      timezone: formData.get("timezone"),
      lastContact: formData.get("lastContact"),
      notes: formData.get("notes"),
      agentId: formData.get("agentId"),
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
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Target</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Target</DialogTitle>
          <DialogDescription>
            Add a new target to your project. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input id='name' name='name' className='col-span-2' required />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='company' className='text-right'>
                Company
              </Label>
              <Input id='company' name='company' className='col-span-2' />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='position' className='text-right'>
                Position
              </Label>
              <Input
                id='position'
                name='position'
                type='text'
                className='col-span-2'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='industry' className='text-right'>
                Industry
              </Label>
              <Input
                id='industry'
                name='industry'
                type='text'
                className='col-span-2'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='contactInCommon' className='text-right'>
                Contact In Common
              </Label>
              <Input
                id='contactInCommon'
                name='contactInCommon'
                type='text'
                className='col-span-2'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='bestTimeToCall' className='text-right'>
                Best Time To Call
              </Label>
              <Select name='bestTimeToCall'>
                <SelectTrigger className='col-span-2'>
                  <SelectValue placeholder='Select best time to call' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='morning'>
                    Morning (9:00 AM - 12:00 PM)
                  </SelectItem>
                  <SelectItem value='afternoon'>
                    Afternoon (12:00 PM - 5:00 PM)
                  </SelectItem>
                  <SelectItem value='evening'>
                    Evening (5:00 PM - 8:00 PM)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='timezone' className='text-right'>
                Timezone
              </Label>
              <Select name='timezone'>
                <SelectTrigger className='col-span-2'>
                  <SelectValue placeholder='Select timezone' />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((zone: string) => (
                    <SelectItem key={zone} value={zone}>
                      {zone.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='lastContact' className='text-right'>
                Last Contact
              </Label>
              <Input
                id='lastContact'
                name='lastContact'
                type='datetime-local'
                className='col-span-2'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                className='col-span-2'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='phone' className='text-right'>
                Phone
              </Label>
              <Input
                id='phone'
                name='phone'
                type='tel'
                className='col-span-2'
                required
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='agent' className='text-right'>
                Agent
              </Label>
              <Select name='agentId'>
                <SelectTrigger className='col-span-2'>
                  <SelectValue placeholder='Select an agent' />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.agent_id} value={agent.agent_id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='notes' className='text-right'>
                Notes
              </Label>
              <Input id='notes' name='notes' className='col-span-2' />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={loading}>
              {loading ? "Adding..." : "Add Target"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
