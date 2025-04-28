
import React from 'react';
import { Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Event } from '@/hooks/useEvents';

// Change the interface to accept an Event object instead of individual props
export interface EventHeaderProps {
  event: Event;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const { title, start_date, description } = event;
  
  // Format the date and extract time
  const formattedDate = new Date(start_date).toLocaleDateString();
  const formattedTime = new Date(start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Use venue data if available, otherwise use placeholder
  const location = event.venue_id || "Venue not specified";
  
  return (
    <div className="mb-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {title}
      </h1>
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          {formattedDate} | {formattedTime}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-500" />
          {location}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {description || "No description available."}
      </p>
    </div>
  );
};
