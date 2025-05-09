
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UserTicket } from '@/hooks/tickets';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useLanguage } from '@/features/language';
import { AdminTicketRow } from './AdminTicketRow';
import { EmptyOrErrorState } from '@/components/admin/EmptyOrErrorState';

export function AdminTicketsList() {
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const {
    data: tickets = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      try {
        const { data: ticketsData, error } = await supabase
          .from('tickets')
          .select('*, categories(name), registered_users!tickets_seller_id_fkey(first_name, last_name)')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching tickets:', error);
          throw error;
        }

        // Transform to UserTicket format
        return (ticketsData || []).map((ticket: any): UserTicket => ({
          id: String(ticket.id),
          title: ticket.title || ticket.description || "Ticket",
          description: ticket.description || undefined,
          category: ticket.category_name || ticket.categories?.name || 'Other',
          price: ticket.price,
          event_id: ticket.event_id,
          status: ticket.status || 'available',
          file_path: ticket.file_path,
          created_at: ticket.created_at,
          seller_id: ticket.seller_id,
          buyer_id: ticket.buyer_id,
          owner_id: ticket.owner_id,
          event_date: ticket.event_date || null,
          venue: ticket.venue || null,
          quantity: ticket.quantity || 1,
          price_per_unit: ticket.price_per_unit || ticket.price || 0,
          event_time: ticket.event_time || null,
          seller_name: ticket.registered_users ? 
            `${ticket.registered_users.first_name} ${ticket.registered_users.last_name}` : undefined
        }));
      } catch (err) {
        console.error('Error in fetchTickets:', err);
        throw err;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // Filter tickets based on search query
  const filteredTickets = tickets.filter((ticket) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(query) ||
      (ticket.description?.toLowerCase().includes(query) || '') ||
      (ticket.category?.toLowerCase().includes(query) || '') ||
      (ticket.seller_name?.toLowerCase().includes(query) || '')
    );
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (error) {
    return (
      <EmptyOrErrorState
        title={t("Kļūda ielādējot biļetes", "Error loading tickets")}
        description={t("Mēģiniet vēlreiz vēlāk", "Please try again later")}
        icon="alert-triangle"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t("Biļešu pārvaldība", "Tickets Management")}
        </h2>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("Atjaunot", "Refresh")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t("Meklēt biļetes...", "Search tickets...")}
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Nosaukums", "Title")}</TableHead>
              <TableHead>{t("Kategorija", "Category")}</TableHead>
              <TableHead>{t("Pārdevējs", "Seller")}</TableHead>
              <TableHead>{t("Cena", "Price")}</TableHead>
              <TableHead>{t("Datums", "Date")}</TableHead>
              <TableHead>{t("Statuss", "Status")}</TableHead>
              <TableHead>{t("Darbības", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <AdminTicketRow key={ticket.id} ticket={ticket} onRefresh={refetch} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? t("Nav atrasta neviena biļete", "No tickets found matching your search")
                    : t("Nav atrasta neviena biļete", "No tickets found")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
