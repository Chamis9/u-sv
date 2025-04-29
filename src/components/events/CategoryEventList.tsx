
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { useEvents } from '@/hooks/useEvents';
import { getCategoryDisplayName, getCategoryIdFromName } from './utils/categoryUtils';
import { CategoryHeader } from './components/CategoryHeader';
import { EventsGrid } from './components/EventsGrid';
import { PurchaseDialog } from './components/PurchaseDialog';
import { useCategoryTickets } from '@/hooks/useCategoryTickets';
import { useTicketPurchase } from '@/hooks/useTicketPurchase';
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Search, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export function CategoryEventList() {
  const { category } = useParams<{ category: string }>();
  const { data: events, isLoading, error } = useEvents(category);
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  // Get category ID for filtering tickets
  const categoryId = category ? getCategoryIdFromName(category) : '';
  
  const {
    allCategoryTickets,
    isLoading: ticketsLoading,
    removeTicketFromState
  } = useCategoryTickets(category);
  
  const {
    selectedTicket,
    isPurchaseDialogOpen,
    setIsPurchaseDialogOpen,
    openPurchaseDialog,
    purchaseTicket
  } = useTicketPurchase();

  const handlePurchaseConfirm = async (ticket: typeof selectedTicket) => {
    if (!ticket) return;
    
    const success = await purchaseTicket(ticket);
    if (success) {
      removeTicketFromState(ticket.id);
    }
  };

  // Filter events based on search query and dates
  const filteredEvents = events?.filter(event => {
    // Text search filter
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Date filter
    let matchesDateRange = true;
    if (startDate) {
      const eventDate = new Date(event.start_date);
      matchesDateRange = eventDate >= startDate;
    }
    if (endDate) {
      const eventDate = new Date(event.start_date);
      matchesDateRange = matchesDateRange && eventDate <= endDate;
    }
    
    return matchesSearch && matchesDateRange;
  }) || [];

  // Filter tickets based on search query and category
  const filteredTickets = allCategoryTickets.filter(ticket => {
    // Only show tickets for this category
    if (categoryId && ticket.category !== categoryId) return false;
    
    // Text search filter
    return searchQuery
      ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
  });

  if (error) {
    return (
      <div className="text-center p-8">
        {currentLanguage.code === 'lv' ? 'Kļūda ielādējot datus' : 'Error loading data'}
      </div>
    );
  }

  // Determine category display name
  const categoryDisplayName = category ? getCategoryDisplayName(categoryId, currentLanguage.code) : '';
  
  // Format the date range for display
  const dateButtonText = startDate && endDate
    ? `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`
    : currentLanguage.code === 'lv' ? 'Izvēlies datumus' : 'Select dates';

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <CategoryHeader categoryDisplayName={categoryDisplayName} />
              
              {/* Search and Date Filter */}
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
              
              {/* Events Grid */}
              <EventsGrid 
                events={filteredEvents}
                availableTickets={filteredTickets} 
                isLoading={isLoading || ticketsLoading}
                onPurchase={openPurchaseDialog}
              />
            </div>
          </div>
        </main>
        
        {/* Purchase Dialog */}
        <PurchaseDialog
          ticket={selectedTicket}
          isOpen={isPurchaseDialogOpen}
          onOpenChange={setIsPurchaseDialogOpen}
          onPurchaseConfirm={handlePurchaseConfirm}
        />
        
        <Footer />
        <GlobalThemeToggle />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
