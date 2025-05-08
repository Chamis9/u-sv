
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { lv } from "date-fns/locale";
import { CalendarIcon, Eye, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserTicket } from "@/hooks/tickets";

interface TicketItemProps {
  ticket: UserTicket;
  onView: () => void;
  onPurchase: (ticket: UserTicket) => void;
  onDelete?: (ticketId: string) => void;
  isAuthenticated: boolean;
  userId?: string | null;
  currentLanguageCode: string;
  t: (lvText: string, enText: string) => string;
  isDeleting: boolean;
}

export const TicketItem: React.FC<TicketItemProps> = ({
  ticket,
  onView,
  onPurchase,
  onDelete,
  isAuthenticated,
  userId,
  currentLanguageCode,
  t,
  isDeleting
}) => {
  // Format the posted date
  const getFormattedDate = () => {
    try {
      const postedDate = new Date(ticket.created_at);
      if (isNaN(postedDate.getTime())) {
        return "";
      }
      
      return formatDistanceToNow(postedDate, {
        addSuffix: true,
        locale: currentLanguageCode === "lv" ? lv : undefined
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Check if ticket belongs to current user
  // Changed from user_id to seller_id for ownership check
  const isOwner = userId && ticket.seller_id === userId;
  
  return (
    <Card className="overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-all bg-ticket-bg/80 border border-ticket-text/20 backdrop-blur-sm">
      <div className="h-2 bg-ticket-accent w-full"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-ticket-text">{ticket.title}</CardTitle>
        <CardDescription className="text-ticket-text/80">
          {ticket.event_date && (
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarIcon className="h-4 w-4 text-ticket-accent" />
              <span>{new Date(ticket.event_date).toLocaleDateString(currentLanguageCode === "lv" ? "lv-LV" : "en-US")}</span>
            </div>
          )}
          <div className="line-clamp-2">{ticket.description}</div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-0 flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="font-medium bg-ticket-bg/50 border-ticket-text/30 text-ticket-text">
            {t("Lietotāja biļete", "User ticket")} 
          </Badge>
          <Badge variant="outline" className="font-medium bg-ticket-bg/50 border-ticket-text/30 text-ticket-text">
            {t("Cena", "Price")}: {ticket.price}€
          </Badge>
        </div>
        {ticket.created_at && (
          <div className="text-sm text-ticket-text/70 mt-2">
            {t("Pievienota", "Posted")} {getFormattedDate()}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 mt-auto">
        <div className="flex flex-wrap items-center gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-ticket-text/30 bg-ticket-bg/30 text-ticket-text hover:bg-ticket-bg/50"
            onClick={onView}
          >
            <Eye className="w-4 h-4 mr-2" /> 
            {t("Skatīt", "View")}
          </Button>
          
          {isAuthenticated && !isOwner && (
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 bg-ticket-accent hover:bg-ticket-accent/80 text-ticket-bg"
              onClick={() => onPurchase(ticket)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t("Pirkt", "Purchase")}
            </Button>
          )}
          
          {isOwner && onDelete && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onDelete(ticket.id)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t("Dzēst", "Delete")}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
