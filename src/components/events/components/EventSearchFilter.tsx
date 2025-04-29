
import React from 'react';
import { format } from "date-fns";
import { useLanguage } from "@/features/language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, CalendarIcon } from "lucide-react";

interface EventSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  startDate?: Date;
  setStartDate: (date?: Date) => void;
  endDate?: Date;
  setEndDate: (date?: Date) => void;
}

export const EventSearchFilter: React.FC<EventSearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  const { currentLanguage } = useLanguage();
  
  // Format the date range for display
  const dateButtonText = startDate && endDate
    ? `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`
    : currentLanguage.code === 'lv' ? 'Izvēlies datumus' : 'Select dates';

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <Input
          type="search"
          placeholder={currentLanguage.code === 'lv' ? "Meklēt pasākumus un biļetes..." : "Search events and tickets..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-[300px]">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateButtonText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={startDate}
            selected={{
              from: startDate,
              to: endDate
            }}
            onSelect={(range) => {
              setStartDate(range?.from);
              setEndDate(range?.to);
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
