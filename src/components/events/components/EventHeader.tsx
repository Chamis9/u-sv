
import React from 'react';
import { Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/features/language";

interface EventHeaderProps {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  date,
  time,
  location,
  description
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {title}
      </h1>
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          {date} | {time}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-500" />
          {location}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {description}
      </p>
    </div>
  );
};
