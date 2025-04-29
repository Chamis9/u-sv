
import React from "react";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTickets } from "@/hooks/tickets"; 
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyTicketsList } from "./EmptyTicketsList";
import { ListedTicketsTable } from "./ListedTicketsTable";
import { PurchasedTicketsTable } from "./PurchasedTicketsTable";

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
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const renderListedTickets = () => {
    if (isLoadingUserTickets) {
      return <LoadingSpinner />;
    }
    
    if (!userTickets.length) {
      return <EmptyTicketsList type="listed" />;
    }
    
    return <ListedTicketsTable tickets={userTickets} deleteTicket={deleteTicket} />;
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
          {t("Pievienotās biļetes", "Listed Tickets")}
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
