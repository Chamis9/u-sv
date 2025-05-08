
import React, { useState } from 'react';
import { useLanguage } from "@/features/language";
import { Ticket } from "lucide-react";
import { UserTicket } from "@/hooks/tickets";
import { Event } from "@/hooks/useEvents";
import { EmptyStateMessage } from "./EmptyStateMessage";
import { EventCard } from "./EventCard";
import { StandaloneTicketCard } from "./StandaloneTicketCard";
import { TicketPreviewDialog } from "./TicketPreviewDialog";

interface EventsGridProps {
  events: Event[];
  availableTickets: UserTicket[];
  isLoading: boolean;
  onPurchase: (ticket: UserTicket) => void;
}

export const EventsGrid: React.FC<EventsGridProps> = ({ 
  events, 
  availableTickets, 
  isLoading,
  onPurchase 
}) => {
  const { currentLanguage } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const handleViewTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPreviewOpen(true);
  };

  // Group tickets by event ID for easier access
  const ticketsByEvent = availableTickets.reduce((acc, ticket) => {
    const eventId = ticket.event_id || '';
    if (!acc[eventId]) acc[eventId] = [];
    acc[eventId].push(ticket);
    return acc;
  }, {} as Record<string, UserTicket[]>);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-teal-600/50 rounded-lg"></div>
        ))}
      </div>
    );
  }

  // Handle case with no events or tickets
  if (events.length === 0 && availableTickets.length === 0) {
    return (
      <EmptyStateMessage 
        message={{
          lv: 'Šajā kategorijā nav pasākumu vai biļešu',
          en: 'No events or tickets in this category'
        }}
      />
    );
  }

  // Get standalone tickets (not associated with events or associated with events that aren't in our events array)
  const standAloneTickets = availableTickets.filter(ticket => 
    !ticket.event_id || !events.some(event => String(event.id) === ticket.event_id)
  );
  
  return (
    <div className="space-y-12">
      {/* Events with tickets */}
      {events.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const eventId = String(event.id);
            const eventTickets = ticketsByEvent[eventId] || [];
            
            return (
              <EventCard 
                key={event.id}
                event={event}
                eventTickets={eventTickets}
              />
            );
          })}
        </div>
      )}

      {/* Standalone tickets section */}
      {standAloneTickets.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-amber">
            {t('Pieejamās biļetes', 'Available Tickets')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {standAloneTickets.map((ticket) => (
              <StandaloneTicketCard
                key={ticket.id}
                ticket={ticket}
                onViewTicket={handleViewTicket}
                onPurchase={onPurchase}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ticket Preview Dialog - Updated to include onPurchase */}
      <TicketPreviewDialog
        ticket={selectedTicket}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPurchase={onPurchase}
      />
    </div>
  );
}
