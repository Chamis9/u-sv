
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Tag } from "lucide-react";
import { useLanguage } from "@/features/language";
import { UserTicket } from "@/hooks/tickets";

interface AvailableTicketsSectionProps {
  tickets: UserTicket[];
  onPurchase: (ticket: UserTicket) => void;
}

export const AvailableTicketsSection: React.FC<AvailableTicketsSectionProps> = ({ tickets, onPurchase }) => {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string, lt: string, ee: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lv;
      case 'en': return en;
      case 'lt': return lt;
      case 'et':
      case 'ee': return ee;
      default: return lv;
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

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 mb-8 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
        <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium">
          {t("Nav pieejamu biļešu", "No available tickets", "Nėra bilietų", "Pileteid pole saadaval")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t("Šajā kategorijā pašlaik nav pieejamu biļešu", "There are no tickets available in this category at the moment", "Šioje kategorijoje šiuo metu nėra bilietų", "Selles kategoorias pole praegu pileteid saadaval")}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">
        {t("Pieejamās biļetes", "Available Tickets", "Prieinami bilietai", "Saadaolevad piletid")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-orange-500" />
                {ticket.title}
              </CardTitle>
              {ticket.description && (
                <CardDescription>
                  {ticket.description}
                </CardDescription>
              )}
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Tag className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="break-words">{getLocalizedCategory(ticket.category)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {ticket.price} €
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => onPurchase(ticket)} 
                variant="orange" 
                className="w-full"
              >
                {t("Pirkt biļeti", "Buy Ticket", "Pirkti bilietą", "Osta pilet")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
