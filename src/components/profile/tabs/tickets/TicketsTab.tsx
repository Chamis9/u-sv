
import React from "react";
import { User } from "@/types/users";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTicketForm } from "./AddTicketForm";
import { useTicketsTab } from "./hooks/useTicketsTab";
import { 
  TicketsHeader,
  TicketsContent
} from "./components";

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const {
    listedTickets,
    soldTickets,
    isLoading,
    loading,
    addTicketOpen,
    setAddTicketOpen,
    handleDeleteTicket,
    refreshTickets,
    t
  } = useTicketsTab(user);
  
  return (
    <Card>
      <TicketsHeader 
        onAddTicket={() => setAddTicketOpen(true)} 
        onRefresh={refreshTickets}
      />
      
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
            <TicketsContent 
              tickets={listedTickets}
              isLoading={isLoading}
              onDelete={handleDeleteTicket}
              loadingDelete={loading}
              ticketType="listed"
            />
          </TabsContent>
          
          <TabsContent value="sold">
            <TicketsContent 
              tickets={soldTickets}
              isLoading={isLoading}
              onDelete={handleDeleteTicket}
              loadingDelete={loading}
              ticketType="sold"
            />
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
