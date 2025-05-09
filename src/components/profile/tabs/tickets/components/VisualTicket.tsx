
import React, { useState } from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { formatPrice, formatDate } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Ticket as TicketIcon, Calendar, Tag, Download, Eye, MapPin, Clock, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { TicketPreviewDialog } from "@/components/events/components/TicketPreviewDialog";

interface VisualTicketProps {
  ticket: UserTicket;
  onView: (ticket: UserTicket) => void;
  onEdit?: (ticket: UserTicket) => void;
  onDelete?: (id: string) => void;
  ticketType: "added" | "purchased";
}

export function VisualTicket({ ticket, onView, onEdit, onDelete, ticketType }: VisualTicketProps) {
  const { currentLanguage } = useLanguage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
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

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    return timeStr;
  };
  
  const handleViewClick = () => {
    setIsPreviewOpen(true);
    onView(ticket);
  };
  
  const handleDeleteClick = () => {
    if (onDelete) {
      console.log("Delete button clicked for ticket:", ticket.id);
      onDelete(ticket.id);
    }
  };
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Ticket header with color band */}
        <div className={`h-2 ${getStatusColor(ticket.status)}`}></div>
        
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">{ticket.title}</h3>
              <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground mb-1">
                <div className="flex items-center mr-3 mb-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {ticket.event_date 
                    ? formatDate(ticket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')
                    : formatDate(ticket.created_at, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
                </div>
                {ticket.event_time && (
                  <div className="flex items-center mb-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(ticket.event_time)}
                  </div>
                )}
              </div>
              
              {ticket.venue && (
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="truncate">{ticket.venue}</span>
                </div>
              )}
              
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center">
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-muted-foreground" />
                  <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px]">{ticket.category}</span>
                </div>
                <Badge className={`${getStatusColor(ticket.status)} text-xs whitespace-nowrap`}>
                  {getStatusText(ticket.status)}
                </Badge>
              </div>
              
              <div className="text-lg sm:text-xl font-bold text-primary">
                {formatPrice(ticket.price)}
              </div>
              
              {/* Always show quantity and price per unit, even for single tickets */}
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket") : t("biļetes", "tickets")} × {formatPrice(ticket.price_per_unit || ticket.price)}
              </div>
            </div>
            
            <div className="ml-3 mt-1 hidden sm:block">
              <TicketIcon className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewClick}
              className="flex-1 text-xs px-2 h-8"
            >
              <Eye className="h-3 w-3 mr-1" />
              {t("Skatīt", "View")}
            </Button>
            
            {ticket.file_path && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
                }}
                className="flex-1 text-xs px-2 h-8"
              >
                <Download className="h-3 w-3 mr-1" />
                {t("Lejupielādēt", "Download")}
              </Button>
            )}
            
            {ticketType === "added" && ticket.status === 'available' && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(ticket)}
                className="flex-1 text-xs px-2 h-8"
              >
                <Pencil className="h-3 w-3 mr-1" />
                {t("Rediģēt", "Edit")}
              </Button>
            )}
            
            {ticketType === "added" && ticket.status === 'available' && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                className="flex-1 text-xs px-2 h-8"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {t("Dzēst", "Delete")}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Ticket Preview Dialog */}
      <TicketPreviewDialog
        ticket={ticket}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
