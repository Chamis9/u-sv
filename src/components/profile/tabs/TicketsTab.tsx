
import React from "react";
import { User } from "@/types/users";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { useLanguage } from "@/features/language";
import { TicketsTabContent } from "./tickets";

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Manas biļetes", "My Tickets")}</CardTitle>
      </CardHeader>
      <CardContent>
        <TicketsTabContent user={user} />
      </CardContent>
    </Card>
  );
}
