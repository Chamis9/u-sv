
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { useEvents, Event } from "@/hooks/useEvents";
import { EventHeader } from './components/EventHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useAuth } from '@/contexts/AuthContext';
import { TicketList } from '@/components/tickets/TicketList';
import { AddTicketForm } from '@/components/tickets/AddTicketForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function EventTickets() {
  const { eventId, categoryId } = useParams<{ eventId: string, categoryId: string }>();
  const { isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();
  const { data: events, isLoading, error } = useEvents(categoryId);
  
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [addTicketDialogOpen, setAddTicketDialogOpen] = useState(false);
  
  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  // Find the current event from the events array
  const currentEvent: Event | undefined = events?.find(e => e.id === eventId);
  
  const handleSellTicketClick = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    setAddTicketDialogOpen(true);
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO 
          title={currentEvent ? `${currentEvent.title} - netieku.es` : "Event Details - netieku.es"} 
          description={currentEvent?.description || "View and purchase tickets for this event"}
        />
        <Header />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 mb-6"></div>
                </div>
              ) : error ? (
                <div className="text-center p-8">
                  {currentLanguage.code === 'lv' ? 'Kļūda ielādējot datus' : 'Error loading data'}
                </div>
              ) : !currentEvent ? (
                <div className="text-center p-8">
                  {currentLanguage.code === 'lv' ? 'Pasākums nav atrasts' : 'Event not found'}
                </div>
              ) : (
                <>
                  <EventHeader event={currentEvent} />
                  
                  <div className="mt-8 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold">
                      {t("Pieejamās biļetes", "Available tickets")}
                    </h2>
                    
                    <Dialog open={addTicketDialogOpen} onOpenChange={setAddTicketDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleSellTicketClick}>
                          {t("Pārdod savu biļeti", "Sell your ticket")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>{t("Pārdod savu biļeti", "Sell your ticket")}</DialogTitle>
                        </DialogHeader>
                        {eventId && (
                          <AddTicketForm 
                            eventId={eventId} 
                            onSuccess={() => setAddTicketDialogOpen(false)} 
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {eventId && <TicketList eventId={eventId} />}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
        <GlobalThemeToggle />
        <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
      </div>
    </ThemeProvider>
  );
}
