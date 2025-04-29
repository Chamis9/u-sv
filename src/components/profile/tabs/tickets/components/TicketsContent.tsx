
import React, { useState } from "react";
import { UserTicket } from "@/hooks/tickets";
import { TicketsList } from "../TicketsList";
import { TicketsGrid } from "./TicketsGrid";
import { EmptyTicketState } from "./EmptyTicketState";
import { LoadingSpinner } from "@/components/profile/components/LoadingSpinner";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface TicketsContentProps {
  tickets: UserTicket[];
  isLoading: boolean;
  onDelete: (ticketId: string) => void;
  loadingDelete: boolean;
  ticketType: "added" | "purchased";
}

export function TicketsContent({ 
  tickets, 
  isLoading, 
  onDelete, 
  loadingDelete,
  ticketType 
}: TicketsContentProps) {
  const { currentLanguage } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  // Add debug logging
  console.log(`Rendering TicketsContent for ${ticketType} tickets:`, tickets);
  console.log("Current view mode:", viewMode);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (tickets.length === 0) {
    return <EmptyTicketState type={ticketType} />;
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="bg-muted/20 rounded-lg p-1 flex">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8"
            title={t("Režģa skats", "Grid view")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="h-8 w-8"
            title={t("Saraksta skats", "List view")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <TicketsGrid 
          tickets={tickets} 
          isLoading={isLoading}
          onDelete={onDelete}
          loadingDelete={loadingDelete}
          ticketType={ticketType}
          onViewTicket={setSelectedTicket}
        />
      ) : (
        <TicketsList 
          tickets={tickets} 
          onDelete={onDelete}
          isLoading={loadingDelete}
          ticketType={ticketType}
        />
      )}
      
      {/* Re-use existing ticket detail dialog logic from TicketsList */}
      {selectedTicket && (
        <div className="hidden">
          {/* This is a trick to trigger the dialog from TicketsList */}
          <TicketsList 
            tickets={[selectedTicket]} 
            onDelete={() => {}}
            isLoading={false}
            ticketType={ticketType}
          />
        </div>
      )}
    </div>
  );
}
