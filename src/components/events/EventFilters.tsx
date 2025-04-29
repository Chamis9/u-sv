
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useCategories } from '@/hooks/useCategories';
import { format } from "date-fns";

interface EventFiltersProps {
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
  selectedCategory?: string;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
}

export function EventFilters({
  onSearchChange,
  onCategoryChange,
  onDateChange,
  selectedCategory,
  selectedStartDate,
  selectedEndDate
}: EventFiltersProps) {
  const { currentLanguage } = useLanguage();
  const { data: categories } = useCategories();

  const dateButtonText = selectedStartDate && selectedEndDate
    ? `${format(selectedStartDate, 'PP')} - ${format(selectedEndDate, 'PP')}`
    : currentLanguage.code === 'lv' ? 'Izvēlies datumus' : 'Select dates';

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder={currentLanguage.code === 'lv' ? "Meklēt pasākumus..." : "Search events..."}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={currentLanguage.code === 'lv' ? "Visas kategorijas" : "All categories"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {currentLanguage.code === 'lv' ? "Visas kategorijas" : "All categories"}
            </SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              defaultMonth={selectedStartDate}
              selected={{
                from: selectedStartDate,
                to: selectedEndDate
              }}
              onSelect={(range) => {
                onDateChange(range?.from, range?.to);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
