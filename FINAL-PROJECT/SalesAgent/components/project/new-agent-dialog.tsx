"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Llm, Voice } from "elevenlabs/api";
import { supportedLanguages } from "@/lib/utils";
import { AudioPlayer } from "@/components/ui/audio-player";

interface NewAgentDialogProps {
  projectId: string;
}

export function NewAgentDialog({ projectId }: NewAgentDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [open, setOpen] = useState(false);
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch("/api/voices");
        if (!response.ok) {
          throw new Error("Failed to fetch voices");
        }
        const data = await response.json();
        setVoices(data.voices);
      } catch (error) {
        console.error("Failed to fetch voices:", error);
        toast({
          title: "Error",
          description: "Failed to load available voices",
          variant: "destructive",
        });
      } finally {
        setLoadingVoices(false);
      }
    };

    if (open) {
      fetchVoices();
    }
  }, [toast, open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let newTotalSize = 0;
    const fileList = Array.from(files);

    fileList.forEach((file) => {
      newTotalSize += file.size;
    });

    if (newTotalSize > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "Total file size exceeds 25MB limit",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    setTotalFileSize(newTotalSize);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const response = await fetch(`/api/projects/${projectId}/agents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create agent");
      }

      toast({
        title: "Success",
        description: "Agent created successfully",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Create New Agent</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Configure your new AI agent with the desired settings.
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
              <Label htmlFor='language' className='text-right'>
                Language
              </Label>
              <Select name='language' required>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select a language' />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='model' className='text-right'>
                AI Model
              </Label>
              <Select name='model' required>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select an AI model' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Llm).map((llm) => (
                    <SelectItem value={llm} key={llm}>
                      {llm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='voice' className='text-right'>
                Voice
              </Label>
              <Select name='voice' required disabled={loadingVoices}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue
                    placeholder={
                      loadingVoices ? "Loading voices..." : "Select a voice"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <div className='flex mb-1' key={voice.voice_id}>
                      {voice.preview_url && (
                        <AudioPlayer src={voice.preview_url} />
                      )}

                      <SelectItem
                        key={voice.voice_id}
                        value={voice.voice_id}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.closest(".audio-player")) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                        className='cursor-pointer'>
                        <div className='flex items-center gap-2'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className='ml-1 text-sm'>{voice.name}</div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className='text-xs'>{voice.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </SelectItem>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='firstMessage' className='text-right'>
                First Message
              </Label>
              <Textarea
                id='firstMessage'
                name='firstMessage'
                className='col-span-3'
                required
                placeholder='Enter the first message your agent will say'
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='prompt' className='text-right'>
                Agent Prompt
              </Label>
              <Textarea
                id='prompt'
                name='prompt'
                className='col-span-3'
                required
                placeholder="Enter the agent's behavior prompt"
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='documents' className='text-right'>
                Documents
              </Label>
              <div className='col-span-3'>
                <Input
                  id='documents'
                  name='documents'
                  type='file'
                  multiple
                  onChange={handleFileChange}
                  accept='.pdf,.doc,.docx,.txt'
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Total size: {(totalFileSize / (1024 * 1024)).toFixed(2)}MB /
                  25MB
                </p>
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='documents' className='text-right'>
                Links
              </Label>
              <div className='col-span-3'>
                {/* can add links and on space it's a different link */}
                <Input
                  id='links'
                  name='links'
                  type='text'
                  placeholder='Enter links separated by spaces'
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={loading || loadingVoices}>
              {loading ? "Creating..." : "Create Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
