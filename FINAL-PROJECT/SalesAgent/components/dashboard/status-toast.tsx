"use client";

import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function StatusToast() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error) {
      const messages = {
        "no-code": "Failed to receive authorization code from Google",
        "google-auth-failed":
          "Failed to connect to Google Calendar. Please try again.",
      };

      toast({
        variant: "destructive",
        title: "Error",
        description:
          messages[error as keyof typeof messages] || "An error occurred",
      });
    }

    if (success === "calendar-connected") {
      toast({
        title: "Success",
        description: "Google Calendar connected successfully!",
      });
    }
  }, [searchParams, toast]);

  return null;
}
