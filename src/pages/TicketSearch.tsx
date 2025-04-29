
import React, { useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { useTicketById } from "@/hooks/useTicketById";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, formatDate } from "@/utils/formatters";
import { useLanguage } from "@/features/language";
import { Search, FileText, Calendar, MapPin, Tag, Download, UserCheck, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TicketSearch = () => {
  const [ticketId, setTicketId] = useState<string>('');
  const [searchTicketId, setSearchTicketId] = useState<string>('');
  const { ticket, isLoading, error, sourceTable } = useTicketById(searchTicketId);
  const { currentLanguage } = useLanguage();

  const handleSearch = () => {
    setSearchTicketId(ticketId);
  };

  // For pre-filling when coming from URL params
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setTicketId(id);
      setSearchTicketId(id);
    }
  }, []);

  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'sold':
        return <Badge className="bg-blue-500">{t("Pārdota", "Sold")}</Badge>;
      case 'available':
        return <Badge className="bg-green-500">{t("Aktīva", "Active")}</Badge>;
      case 'expired':
        return <Badge className="bg-orange-500">{t("Beigusies", "Expired")}</Badge>;
      default:
        return <Badge className="bg-gray-500">{t("Nezināms", "Unknown")}</Badge>;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO title={t("Biļetes meklēšana", "Ticket Search")} />
        <Header />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-orange-500">{t("Biļetes meklēšana", "Ticket Search")}</span>
              </h1>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{t("Meklēt biļeti pēc ID", "Search Ticket by ID")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Input
                        type="text"
                        placeholder={t("Ievadiet biļetes ID...", "Enter ticket ID...")}
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    <Button onClick={handleSearch} disabled={!ticketId}>
                      {t("Meklēt", "Search")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}

              {!isLoading && error && (
                <Card className="border-red-300 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="text-red-600 dark:text-red-400">
                      {t("Kļūda meklējot biļeti:", "Error searching for ticket:")} {error.message}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isLoading && !error && !ticket && searchTicketId && (
                <Card className="border-yellow-300 dark:border-yellow-800">
                  <CardContent className="pt-6">
                    <div className="text-yellow-600 dark:text-yellow-400">
                      {t("Biļete nav atrasta", "Ticket not found")}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isLoading && ticket && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Biļetes informācija", "Ticket Information")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{ticket.title || t("Biļete", "Ticket")}</span>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-muted-foreground" />
                      <span>{ticket.category}</span>
                    </div>

                    {ticket.event_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span>
                          {formatDate(ticket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
                        </span>
                      </div>
                    )}

                    {ticket.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span>{ticket.venue}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground text-sm">
                        {t("Cena", "Price")}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(ticket.price)}
                      </div>
                    </div>

                    {ticket.description && (
                      <div className="flex flex-col gap-1">
                        <div className="text-muted-foreground text-sm">
                          {t("Apraksts", "Description")}
                        </div>
                        <div>{ticket.description}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-muted-foreground text-sm">
                          {t("Pārdevējs ID", "Seller ID")}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" />
                          <span className="text-sm font-mono">{ticket.seller_id || "-"}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="text-muted-foreground text-sm">
                          {t("Pircējs ID", "Buyer ID")}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserMinus className="h-4 w-4" />
                          <span className="text-sm font-mono">{ticket.buyer_id || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground text-sm">
                        {t("Biļetes ID", "Ticket ID")}
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded-md">
                        {ticket.id}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground text-sm">
                        {t("Tabula", "Source Table")}
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded-md">
                        {sourceTable}
                      </div>
                    </div>

                    {ticket.file_path && (
                      <div className="pt-4">
                        <Button
                          onClick={() => {
                            window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {t("Lejupielādēt biļeti", "Download Ticket")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
        <GlobalThemeToggle />
      </div>
    </ThemeProvider>
  );
};

export default TicketSearch;
