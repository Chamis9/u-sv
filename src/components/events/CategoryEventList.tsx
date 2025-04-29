
import React from 'react';
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

export function CategoryEventList() {
  const { category } = useParams<{ category: string }>();
  const { data: events, isLoading, error } = useEvents(category);
  const { currentLanguage } = useLanguage();
  
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

  if (error) {
    return (
      <div className="text-center p-8">
        {currentLanguage.code === 'lv' ? 'Kļūda ielādējot datus' : 'Error loading data'}
      </div>
    );
  }

  // Determine category display name
  const categoryId = category ? getCategoryIdFromName(category) : '';
  const categoryDisplayName = category ? getCategoryDisplayName(categoryId, currentLanguage.code) : '';

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <CategoryHeader categoryDisplayName={categoryDisplayName} />
              
              {/* Events Grid */}
              <EventsGrid 
                events={events || []}
                availableTickets={allCategoryTickets} 
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
