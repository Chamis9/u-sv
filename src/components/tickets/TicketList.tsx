
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, useTickets } from "@/hooks/tickets"; // Updated import path
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Tag, MapPin, Info, TicketIcon, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginDialog } from "@/components/auth/LoginDialog";

interface TicketListProps {
  eventId: string;
}

export function TicketList({ eventId }: TicketListProps) {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { eventTickets, isLoadingEventTickets, purchaseTicket } = useTickets(eventId);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const handlePurchaseClick = (ticket: Ticket) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    // Don't allow users to buy their own tickets
    if (ticket.user_id === user?.id) {
      return;
    }

    purchaseTicket.mutate({ 
      ticketId: ticket.id, 
      sellerId: ticket.user_id 
    });
  };

  if (isLoadingEventTickets) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (eventTickets.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("Nav pieejamu biļešu", "No tickets available")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("Šobrīd šim pasākumam nav pieejamas biļetes.", "There are currently no tickets available for this event.")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {eventTickets.map((ticket) => (
          <Card key={ticket.id} className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-2xl font-semibold">€{ticket.price.toFixed(2)}</span>
                {ticket.user_id === user?.id && (
                  <span className="text-xs bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 px-2 py-1 rounded-md">
                    {t("Tava biļete", "Your ticket")}
                  </span>
                )}
              </CardTitle>
              {ticket.seat_info && (
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {ticket.seat_info}
                </CardDescription>
              )}
            </CardHeader>
            {ticket.description && (
              <CardContent>
                <div className="flex items-start gap-1">
                  <Info className="h-4 w-4 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.description}</p>
                </div>
              </CardContent>
            )}
            <CardFooter className="flex justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ID: {ticket.id.substring(0, 8)}...
              </div>
              <Button 
                onClick={() => handlePurchaseClick(ticket)}
                disabled={purchaseTicket.isPending || ticket.user_id === user?.id}
                variant={ticket.user_id === user?.id ? "outline" : "default"}
              >
                {ticket.user_id === user?.id ? (
                  <span className="flex items-center gap-1">
                    <TicketIcon className="h-4 w-4" />
                    {t("Tava biļete", "Your ticket")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    {t("Pirkt biļeti", "Purchase ticket")}
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </>
  );
}
