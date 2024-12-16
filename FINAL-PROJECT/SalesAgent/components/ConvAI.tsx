"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Conversation } from "@11labs/client";
import { cn } from "@/lib/utils";
import { ITarget } from "@/models";
import { useToast } from "@/hooks/use-toast";
import { ObjectId } from "mongoose";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    return false;
  }
}

async function getSignedUrl(agentId: string): Promise<string> {
  const response = await fetch("/api/signed-url/" + agentId);
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const { signedUrl } = await response.json();
  return signedUrl;
}

async function saveConversationId(
  agentId: string,
  conversationId: string,
  targetId: ObjectId,
  projectId: ObjectId
) {
  await fetch(`/api/projects/${projectId}/calls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversationId, agentId, targetId: targetId }),
  });
}

async function callEnded(conversationId: string, projectId: ObjectId) {
  await fetch(`/api/projects/${projectId}/calls`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversationId }),
  });
}

export function ConvAI({
  agentId,
  target,
}: {
  agentId: string;
  target: ITarget;
}) {
  const { toast } = useToast();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  async function startConversation() {
    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "Microphone access is required for the conversation",
        });
        return;
      }

      const signedUrl = await getSignedUrl(agentId);

      console.log("Signed URL:", signedUrl);

      const conversation = await Conversation.startSession({
        signedUrl: signedUrl,
        onConnect: () => {
          setIsConnected(true);
          setIsSpeaking(true);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsSpeaking(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: error,
          });
        },
        onModeChange: ({ mode }) => {
          setIsSpeaking(mode === "speaking");
        },
      });

      const conversationId = conversation.getId();

      saveConversationId(agentId, conversationId, target._id, target.projectId);

      setConversation(conversation);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start conversation. Please try again.",
      });
    }
  }

  async function endConversation() {
    if (conversation) {
      callEnded(conversation.getId(), target.projectId);

      await conversation.endSession();

      setConversation(null);
    }
  }

  return (
    <div className={"flex justify-center items-center gap-x-4 m-auto"}>
      <Card className={"rounded-3xl"}>
        <CardContent>
          <CardHeader>
            <CardTitle className={"text-center"}>
              {isConnected
                ? isSpeaking
                  ? "Agent is speaking"
                  : "Agent is listening"
                : "Disconnected"}
            </CardTitle>
            <CardDescription className={"text-center"}>
              Target: {target.name}
            </CardDescription>
          </CardHeader>
          <div className={"flex flex-col gap-y-4 text-center"}>
            <div
              className={cn(
                "orb my-16 mx-12",
                isSpeaking ? "animate-orb" : conversation && "animate-orb-slow",
                isConnected ? "orb-active" : "orb-inactive"
              )}></div>

            <Button
              className={"rounded-full"}
              size={"lg"}
              disabled={conversation !== null && isConnected}
              onClick={startConversation}>
              Start conversation
            </Button>

            <Button
              className={"rounded-full"}
              size={"lg"}
              disabled={conversation === null && !isConnected}
              onClick={endConversation}>
              End conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
