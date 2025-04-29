
import React, { useState } from "react";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTickets } from "@/hooks/tickets"; 
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyTicketsList } from "./EmptyTicketsList";
import { ListedTicketsTable } from "./ListedTicketsTable";
import { PurchasedTicketsTable } from "./PurchasedTicketsTable";
import { AddTicketForm } from "./AddTicketForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface TicketsTabContentProps {
  user: User;
}

export const TicketsTabContent: React.FC<TicketsTabContentProps> = ({ user }) => {
  const { currentLanguage } = useLanguage();
  const { 
    userTickets, 
    userPurchases, 
    isLoadingUserTickets, 
    isLoadingUserPurchases, 
    deleteTicket 
  } = useTickets();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const renderListedTickets = () => {
    if (isLoadingUserTickets) {
      return <LoadingSpinner />;
    }
    
    if (!userTickets.length && !showAddForm) {
      return (
        <div className="space-y-4">
          <EmptyTicketsList type="listed" />
          <div className="text-center">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="mt-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("Pievienot biļeti", "Add ticket")}
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {showAddForm && (
          <div className="mb-8">
            <AddTicketForm 
              onCancel={() => setShowAddForm(false)} 
              onSuccess={() => setShowAddForm(false)}
            />
          </div>
        )}
        
        {!showAddForm && userTickets.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAddForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("Pievienot biļeti", "Add ticket")}
            </Button>
          </div>
        )}
        
        {userTickets.length > 0 && (
          <ListedTicketsTable tickets={userTickets} deleteTicket={deleteTicket} />
        )}
      </div>
    );
  };
  
  const renderPurchasedTickets = () => {
    if (isLoadingUserPurchases) {
      return <LoadingSpinner />;
    }
    
    if (!userPurchases.length) {
      return <EmptyTicketsList type="purchased" />;
    }
    
    return <PurchasedTicketsTable purchases={userPurchases} />;
  };
  
  return (
    <Tabs defaultValue="listed">
      <TabsList className="mb-4">
        <TabsTrigger value="listed">
          {t("Manas biļetes", "My Tickets")}
        </TabsTrigger>
        <TabsTrigger value="purchased">
          {t("Iegādātās biļetes", "Purchased Tickets")}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="listed">
        {renderListedTickets()}
      </TabsContent>
      
      <TabsContent value="purchased">
        {renderPurchasedTickets()}
      </TabsContent>
    </Tabs>
  );
};
