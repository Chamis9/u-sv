
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/features/language";
import { Event } from "@/hooks/useEvents";
import { UserTicket } from "@/hooks/tickets";
import { Skeleton } from "@/components/ui/skeleton";

interface EventsSectionProps {
  events: Event[];
  availableTickets: Record<string, UserTicket[]>;
  category?: string;
  isLoading: boolean;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, availableTickets, category, isLoading }) => {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  if (isLoading) {
    return (
      <>
        <h2 className="text-2xl font-bold mb-4 text-cream">{t("Pasākumi", "Events")}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-teal-600/50 rounded-lg"></div>
          ))}
        </div>
      </>
    );
  }

  if (!events || events.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-bold mb-4 text-cream">{t("Pasākumi", "Events")}</h2>
        <div className="text-center py-8 bg-teal-600/50 rounded-lg">
          <Calendar className="h-12 w-12 text-cream/50 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-cream">
            {t("Nav atrasts neviens pasākums", "No events found")}
          </h3>
          <p className="text-cream/70 mt-2">
            {t("Šajā kategorijā pašlaik nav pasākumu", "There are no events in this category at the moment")}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-cream">{t("Pasākumi", "Events")}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col bg-teal-600/50 backdrop-blur-sm border border-cream/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-cream">{event.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 text-amber">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.start_date).toLocaleDateString(currentLanguage.code)}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cream/70">
                {event.description}
              </p>
              
              {/* Display available tickets if any */}
              {availableTickets[event.id]?.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket className="h-4 w-4 text-amber" />
                    <span className="font-medium text-cream">
                      {t('Pieejamās biļetes', 'Available tickets')}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {availableTickets[event.id].map((ticket) => (
                      <div key={ticket.id} className="flex justify-between items-center p-2 border border-cream/20 rounded-md bg-teal-600/70">
                        <div>
                          <div className="font-medium text-cream">{ticket.title}</div>
                          <div className="text-sm text-cream/70">{ticket.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-amber">{ticket.price} €</div>
                          <Badge className="bg-amber text-teal-500">
                            {t('Aktīva', 'Active')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold text-cream">
                  {event.price_range ? `${event.price_range[0]} - ${event.price_range[1]} €` : ''}
                </span>
                <Link to={`/events/${category}/${event.id}`}>
                  <Button variant="cream" className="bg-cream text-teal-500 hover:bg-cream-dark">
                    <Ticket className="mr-2 h-4 w-4" />
                    {t('Biļetes', 'Tickets')}
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};
