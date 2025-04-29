
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
  Calendar,
  Clock,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTicketForm from "../tickets/AddTicketForm";
import UserTicketsList from "../tickets/UserTicketsList";

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const { currentLanguage } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("Manas biļetes", "My Tickets")}</CardTitle>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "outline" : "default"}
        >
          {showAddForm ? (
            t("Atcelt", "Cancel")
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {t("Pievienot biļeti", "Add ticket")}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {showAddForm ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">
              {t("Pievienot jaunu biļeti", "Add new ticket")}
            </h3>
            <AddTicketForm />
          </div>
        ) : (
          <Tabs defaultValue="my_tickets">
            <TabsList className="mb-4">
              <TabsTrigger value="my_tickets">
                {t("Manas biļetes", "My Tickets")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my_tickets">
              <UserTicketsList />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
