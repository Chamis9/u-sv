
import React from "react";
import { useLanguage } from "@/features/language";
import { Ticket as TicketIcon, ShoppingBag } from "lucide-react";

interface EmptyTicketStateProps {
  type: "added" | "purchased";
}

export function EmptyTicketState({ type }: EmptyTicketStateProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
    
  let Icon = TicketIcon;
  let title = "";
  let description = "";
  
  switch (type) {
    case "added":
      Icon = TicketIcon;
      title = t("Nav pievienotu biļešu", "No added tickets");
      description = t("Jūs vēl neesat pievienojis nevienu biļeti pārdošanā", "You haven't added any tickets for sale yet");
      break;
    case "purchased":
      Icon = ShoppingBag;
      title = t("Nav iegādātu biļešu", "No purchased tickets");
      description = t("Jūs vēl neesat iegādājies nevienu biļeti", "You haven't purchased any tickets yet");
      break;
    default:
      title = t("Nav biļešu", "No tickets");
      description = t("Šeit tiks rādītas jūsu biļetes", "Your tickets will be shown here");
  }
  
  return (
    <div className="text-center p-8">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <p className="mt-2 text-lg font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
