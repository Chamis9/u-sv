
import React, { useState } from 'react';
import { format } from "date-fns";
import { useLanguage } from "@/features/language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, CalendarIcon, X, Check } from "lucide-react";

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
  
  // Temporary state for calendar selection before confirmation
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
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
    setTempStartDate(undefined);
    setTempEndDate(undefined);
  };

  // Confirm date selection and close popover
  const confirmDateSelection = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setIsCalendarOpen(false);
  };

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <Input
          type="search"
          placeholder={t("Meklēt pasākumus un biļetes...", "Search events and tickets...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-[300px] flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">{dateButtonText}</span>
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
          <div className="p-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={startDate || new Date()}
              selected={{
                from: tempStartDate,
                to: tempEndDate
              }}
              onSelect={(range) => {
                setTempStartDate(range?.from);
                setTempEndDate(range?.to);
              }}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
            <div className="flex justify-end mt-2 border-t pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsCalendarOpen(false)}
                className="mr-2"
              >
                {t("Atcelt", "Cancel")}
              </Button>
              <Button 
                variant="orange" 
                size="sm"
                onClick={confirmDateSelection}
                className="flex items-center"
              >
                <Check className="mr-1 h-4 w-4" />
                {t("Apstiprināt", "Confirm")}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
