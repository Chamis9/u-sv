
import React, { useEffect } from "react";
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
    addedTickets,
    purchasedTickets,
    isLoading,
    loading,
    addTicketOpen,
    setAddTicketOpen,
    handleDeleteTicket,
    refreshTickets,
    t
  } = useTicketsTab(user);
  
  // Force refresh on component mount and when user changes
  useEffect(() => {
    console.log("TicketsTab mounted or user changed, forcing refresh");
    refreshTickets();
  }, [user.id]);
  
  return (
    <Card>
      <TicketsHeader 
        onAddTicket={() => setAddTicketOpen(true)} 
        onRefresh={refreshTickets}
      />
      
      <CardContent>
        <Tabs defaultValue="added">
          <TabsList className="mb-4">
            <TabsTrigger value="added">
              {t("Pievienotās biļetes", "Added Tickets")} {addedTickets.length > 0 && `(${addedTickets.length})`}
            </TabsTrigger>
            <TabsTrigger value="purchased">
              {t("Iegādātās biļetes", "Purchased Tickets")} {purchasedTickets.length > 0 && `(${purchasedTickets.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="added">
            <TicketsContent 
              tickets={addedTickets}
              isLoading={isLoading}
              onDelete={handleDeleteTicket}
              loadingDelete={loading}
              ticketType="added"
            />
          </TabsContent>
          
          <TabsContent value="purchased">
            <TicketsContent 
              tickets={purchasedTickets}
              isLoading={isLoading}
              onDelete={handleDeleteTicket}
              loadingDelete={loading}
              ticketType="purchased"
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
