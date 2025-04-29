
import React, { useState, useEffect } from "react";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Ticket as TicketIcon,
  Tag,
  Plus,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTicketForm } from "./tickets/AddTicketForm";
import { TicketsList } from "./tickets/TicketsList";
import { useUserTickets } from "@/hooks/useUserTickets";
import { useQueryClient } from "@tanstack/react-query";

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const { currentLanguage } = useLanguage();
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { 
    tickets, 
    isLoading, 
    loading, 
    deleteTicket 
  } = useUserTickets(user.id);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const listedTickets = tickets.filter(ticket => ticket.status === 'available' || ticket.status === 'expired');
  const soldTickets = tickets.filter(ticket => ticket.status === 'sold');
  
  const handleDeleteTicket = (ticketId: string) => {
    if (window.confirm(t("Vai tiešām vēlaties dzēst šo biļeti?", "Are you sure you want to delete this ticket?"))) {
      deleteTicket(ticketId);
    }
  };

  const refreshTickets = () => {
    queryClient.invalidateQueries({ queryKey: ['user-tickets', user.id] });
  };
  
  // Automatically refresh tickets when component mounts
  useEffect(() => {
    refreshTickets();
  }, []);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("Manas biļetes", "My Tickets")}</CardTitle>
        <div className="flex space-x-2">
          <Button onClick={refreshTickets} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("Atsvaidzināt", "Refresh")}
          </Button>
          <Button onClick={() => setAddTicketOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t("Pievienot biļeti", "Add Ticket")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="listed">
          <TabsList className="mb-4">
            <TabsTrigger value="listed">
              {t("Pievienotās biļetes", "Listed Tickets")} {listedTickets.length > 0 && `(${listedTickets.length})`}
            </TabsTrigger>
            <TabsTrigger value="sold">
              {t("Pārdotās biļetes", "Sold Tickets")} {soldTickets.length > 0 && `(${soldTickets.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listed">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : listedTickets.length > 0 ? (
              <TicketsList 
                tickets={listedTickets} 
                onDelete={handleDeleteTicket}
                isLoading={loading || isLoading}
              />
            ) : (
              <div className="text-center p-8">
                <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-2 text-lg font-medium">{t("Nav pievienotu biļešu", "No listed tickets")}</p>
                <p className="text-sm text-muted-foreground">{t("Jūs vēl neesat pievienojis nevienu biļeti pārdošanā", "You haven't listed any tickets for sale yet")}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sold">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : soldTickets.length > 0 ? (
              <TicketsList 
                tickets={soldTickets} 
                onDelete={handleDeleteTicket}
                isLoading={loading || isLoading}
              />
            ) : (
              <div className="text-center p-8">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-2 text-lg font-medium">{t("Nav pārdotu biļešu", "No sold tickets")}</p>
                <p className="text-sm text-muted-foreground">{t("Jūs vēl neesat pārdevis nevienu biļeti", "You haven't sold any tickets yet")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Add Ticket Dialog */}
      <Dialog open={addTicketOpen} onOpenChange={setAddTicketOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Pievienot biļeti", "Add Ticket")}</DialogTitle>
          </DialogHeader>
          <AddTicketForm onClose={() => {
            setAddTicketOpen(false);
            refreshTickets();
          }} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
