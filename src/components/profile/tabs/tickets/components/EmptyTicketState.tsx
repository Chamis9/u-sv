
import React from "react";
import { useLanguage } from "@/features/language";
import { Ticket as TicketIcon, Tag } from "lucide-react";

interface EmptyTicketStateProps {
  type: "listed" | "sold";
}

export function EmptyTicketState({ type }: EmptyTicketStateProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
    
  const Icon = type === "listed" ? TicketIcon : Tag;
  const title = type === "listed" 
    ? t("Nav pievienotu biļešu", "No listed tickets")
    : t("Nav pārdotu biļešu", "No sold tickets");
    
  const description = type === "listed"
    ? t("Jūs vēl neesat pievienojis nevienu biļeti pārdošanā", "You haven't listed any tickets for sale yet")
    : t("Jūs vēl neesat pārdevis nevienu biļeti", "You haven't sold any tickets yet");
  
  return (
    <div className="text-center p-8">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <p className="mt-2 text-lg font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
