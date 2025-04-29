
import React, { useState } from "react";
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
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTicketForm } from "./tickets/AddTicketForm";
import { TicketsList } from "./tickets/TicketsList";
import { useUserTickets } from "@/hooks/useUserTickets";

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const { currentLanguage } = useLanguage();
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  
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
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("Manas biļetes", "My Tickets")}</CardTitle>
        <Button onClick={() => setAddTicketOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t("Pievienot biļeti", "Add Ticket")}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="listed">
          <TabsList className="mb-4">
            <TabsTrigger value="listed">
              {t("Pievienotās biļetes", "Listed Tickets")}
            </TabsTrigger>
            <TabsTrigger value="sold">
              {t("Pārdotās biļetes", "Sold Tickets")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listed">
            {listedTickets.length > 0 ? (
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
            {soldTickets.length > 0 ? (
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
          <AddTicketForm onClose={() => setAddTicketOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
