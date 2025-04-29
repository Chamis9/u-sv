
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
    t,
    isAuthenticated
  } = useTicketsTab(user);
  
  // Force refresh only on component mount and when user changes
  useEffect(() => {
    console.log("TicketsTab mounted or user changed");
    if (isAuthenticated) {
      refreshTickets();
    }
  }, [user.id, isAuthenticated]);

  console.log("TicketsTab render - Current user:", user);
  console.log("TicketsTab render - Authentication state:", isAuthenticated);
  console.log("TicketsTab render - Added tickets:", addedTickets.length);
  console.log("TicketsTab render - Purchased tickets:", purchasedTickets.length);
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("Nav pieslēgts", "Not logged in")}</AlertTitle>
            <AlertDescription>
              {t(
                "Lai redzētu savas biļetes, lūdzu pieslēdzieties savā kontā", 
                "Please log in to view your tickets"
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <TicketsHeader 
        onAddTicket={() => setAddTicketOpen(true)} 
        onRefresh={() => {
          console.log("Manual refresh triggered");
          refreshTickets();
        }}
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
