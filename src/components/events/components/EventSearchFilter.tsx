
import React from 'react';
import { format } from "date-fns";
import { useLanguage } from "@/features/language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, CalendarIcon, X } from "lucide-react";

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
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  // Format the date range for display
  const dateButtonText = startDate && endDate
    ? `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`
    : startDate 
      ? `${format(startDate, 'dd.MM.yyyy')} - ...` 
      : t('Izvēlies datumus', 'Select dates');
  
  // Clear date filters
  const clearDateFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <Input
          type="search"
          placeholder={t("Meklēt pasākumus un biļetes...", "Search events and tickets...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-ticket-text font-semibold border-ticket-accent/30 focus-visible:border-ticket-accent focus-visible:ring-ticket-accent"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-ticket-accent" />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full sm:w-[300px] flex justify-between items-center bg-ticket-bg/70 border-ticket-accent/30 hover:border-ticket-accent text-ticket-text font-semibold"
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-ticket-accent" />
              <span className="truncate">{dateButtonText}</span>
            </div>
            {(startDate || endDate) && (
              <X 
                className="h-4 w-4 text-ticket-text/70 hover:text-ticket-accent" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  clearDateFilters();
                }}
              />
            )}
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
