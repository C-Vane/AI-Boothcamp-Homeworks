"use client";

import { GoogleCalendarButton } from "../google-calendar-button";

export function SettingsSection() {
  return (
    <div className='space-y-4 flex justify-between'>
      <div>
        <h3 className='text-lg font-semibold text-gray-100'>
          Calendar Integration
        </h3>
        <p className='mt-2 text-gray-400'>
          Connect your Google Calendar to allow agents to schedule meetings on
          your behalf
        </p>
      </div>

      <GoogleCalendarButton />
    </div>
  );
}
