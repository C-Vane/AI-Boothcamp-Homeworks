"use client";
import { Button } from "./ui/button";
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function GoogleCalendarButton() {
  const { data: session } = useSession();
  const isConnected = session?.user?.googleCalendarConnected;
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/calendar/auth/url");
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error getting auth URL:", error);
    }
    setIsLoading(false);
  };

  if (!session) return null;

  return (
    <Button
      onClick={handleConnect}
      className='flex items-center gap-2'
      variant={isConnected ? "secondary" : "outline"}
      disabled={isConnected || isLoading}>
      {isLoading ? (
        <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
      ) : (
        <Calendar className='h-4 w-4' />
      )}

      {isLoading
        ? "Connecting..."
        : isConnected
        ? "Calendar Connected"
        : "Connect Google Calendar"}
    </Button>
  );
}
