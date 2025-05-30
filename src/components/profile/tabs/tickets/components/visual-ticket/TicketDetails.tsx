
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { formatPrice, formatDate } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/features/language";

interface TicketDetailsProps {
  ticket: UserTicket;
  t: (lvText: string, enText: string, ltText: string, eeText: string) => string;
}

export function TicketDetails({ ticket, t }: TicketDetailsProps) {
  const { currentLanguage } = useLanguage();
  
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
        return t("Pārdota", "Sold", "Parduotas", "Müüdud");
      case 'available':
        return t("Aktīva", "Active", "Aktyvus", "Aktiivne");
      case 'expired':
        return t("Beigusies", "Expired", "Baigėsi", "Aegunud");
      default:
        return t("Nezināms", "Unknown", "Nežinomas", "Teadmata");
    }
  };

  // Function to get localized category name
  const getLocalizedCategory = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'teātris':
      case 'theatre':
      case 'teatras':
      case 'teater':
        return t('Teātris', 'Theatre', 'Teatras', 'Teater');
      case 'koncerti':
      case 'concerts':
      case 'koncertai':
      case 'kontserdid':
        return t('Koncerti', 'Concerts', 'Koncertai', 'Kontserdid');
      case 'festivāli':
      case 'festivals':
      case 'festivaliai':
      case 'festivalid':
        return t('Festivāli', 'Festivals', 'Festivaliai', 'Festivalid');
      case 'sports':
      case 'sportas':
      case 'sport':
        return t('Sports', 'Sports', 'Sportas', 'Sport');
      case 'kino':
      case 'cinema':
      case 'kinas':
        return t('Kino', 'Cinema', 'Kinas', 'Kino');
      case 'bērniem':
      case 'for children':
      case 'vaikams':
      case 'lastele':
        return t('Bērniem', 'For Children', 'Vaikams', 'Lastele');
      case 'ceļojumi':
      case 'travel':
      case 'kelionės':
      case 'reisimine':
        return t('Ceļojumi', 'Travel', 'Kelionės', 'Reisimine');
      case 'dāvanu kartes':
      case 'gift cards':
      case 'dovanų kortelės':
      case 'kinkekaardid':
        return t('Dāvanu kartes', 'Gift Cards', 'Dovanų kortelės', 'Kinkekaardid');
      case 'citi pasākumi':
      case 'other events':
      case 'kiti renginiai':
      case 'muud üritused':
        return t('Citi pasākumi', 'Other Events', 'Kiti renginiai', 'Muud üritused');
      default:
        return categoryName;
    }
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    return timeStr;
  };

  return (
    <>
      <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground mb-1">
        <div className="flex items-center mr-3 mb-1">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
          {ticket.event_date 
            ? formatDate(ticket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')
            : formatDate(ticket.created_at, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
        </div>
        {ticket.event_time && (
          <div className="flex items-center mb-1">
            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
            {formatTime(ticket.event_time)}
          </div>
        )}
      </div>
      
      {ticket.venue && (
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
          <span className="break-words">{ticket.venue}</span>
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center">
          <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-muted-foreground flex-shrink-0" />
          <span className="text-xs sm:text-sm text-muted-foreground break-words max-w-[150px]">{getLocalizedCategory(ticket.category)}</span>
        </div>
        <Badge className={`${getStatusColor(ticket.status)} text-xs whitespace-nowrap`}>
          {getStatusText(ticket.status)}
        </Badge>
      </div>

      <div className="text-lg sm:text-xl font-bold text-primary mb-1">
        {formatPrice(ticket.price)}
      </div>
      
      <div className="text-xs sm:text-sm text-muted-foreground mb-4">
        {ticket.quantity} {ticket.quantity === 1 
          ? t("biļete", "ticket", "bilietas", "pilet") 
          : t("biļetes", "tickets", "bilietai", "piletid")
        } × {formatPrice(ticket.price_per_unit || ticket.price)}
      </div>
    </>
  );
}
