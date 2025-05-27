
import React from 'react';
import { format } from "date-fns";
import { useLanguage } from "@/features/language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, CalendarIcon, X, Trash2 } from "lucide-react";

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
  
  const t = (lv: string, en: string, lt: string, ee: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lv;
      case 'en': return en;
      case 'lt': return lt;
      case 'et':
      case 'ee': return ee;
      default: return lv;
    }
  };
  
  // Format the date range for display
  const dateButtonText = startDate && endDate
    ? `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`
    : startDate 
      ? `${format(startDate, 'dd.MM.yyyy')} - ...` 
      : t('Izvēlies datumus', 'Select dates', 'Pasirinkite datas', 'Valige kuupäevad');
  
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
          placeholder={t("Meklēt pasākumus un biļetes...", "Search events and tickets...", "Ieškoti renginių ir bilietų...", "Otsige üritusi ja pileteid...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-green-600 dark:text-green-400 focus-visible:ring-ticket-accent focus-visible:ring-2 focus-visible:border-ticket-accent"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-[300px] flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
              {/* Always apply green text color to the dates text */}
              <span className="truncate text-green-600 dark:text-green-400">
                {dateButtonText}
              </span>
            </div>
            {(startDate || endDate) && (
              <X 
                className="h-4 w-4 text-gray-400 hover:text-gray-600" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  clearDateFilters();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 flex flex-col gap-3">
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
            
            {/* Clear button - only show when dates are selected */}
            {(startDate || endDate) && (
              <Button 
                variant="outline" 
                onClick={clearDateFilters}
                className="flex items-center gap-2 self-end text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border-green-600 dark:border-green-400 hover:border-green-700 dark:hover:border-green-300"
              >
                <Trash2 className="h-4 w-4" />
                {t("Notīrīt", "Clear", "Išvalyti", "Tühjenda")}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
