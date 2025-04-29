
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { formatPrice, formatDate } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Ticket as TicketIcon, Calendar, Tag, Download, Eye, MapPin } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";

interface VisualTicketProps {
  ticket: UserTicket;
  onView: (ticket: UserTicket) => void;
  onDelete?: (id: string) => void;
  ticketType: "added" | "purchased";
}

export function VisualTicket({ ticket, onView, onDelete, ticketType }: VisualTicketProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold':
        return "bg-blue-500";
      case 'available':
        return "bg-green-500";
      case 'expired':
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'sold':
        return t("Pārdota", "Sold");
      case 'available':
        return t("Aktīva", "Active");
      case 'expired':
        return t("Beigusies", "Expired");
      default:
        return t("Nezināms", "Unknown");
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Ticket header with color band */}
      <div className={`h-2 ${getStatusColor(ticket.status)}`}></div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1 truncate">{ticket.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              {ticket.event_date 
                ? formatDate(ticket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')
                : formatDate(ticket.created_at, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
            </div>
            
            {ticket.venue && (
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {ticket.venue}
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{ticket.category}</span>
              </div>
              <Badge className={getStatusColor(ticket.status)}>
                {getStatusText(ticket.status)}
              </Badge>
            </div>
            
            <div className="text-xl font-bold text-primary">
              {formatPrice(ticket.price)}
            </div>
          </div>
          
          <div className="ml-4 mt-1">
            <TicketIcon className="h-10 w-10 text-muted-foreground opacity-20" />
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(ticket)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            {t("Skatīt", "View")}
          </Button>
          
          {ticket.file_path && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
              }}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {t("Lejupielādēt", "Download")}
            </Button>
          )}
          
          {ticketType === "added" && ticket.status === 'available' && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(ticket.id)}
              className="flex-1"
            >
              {t("Dzēst", "Delete")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
