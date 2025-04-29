
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/features/language';
import { AdminEventRow } from './events/AdminEventRow';
import { Event } from '@/hooks/useEvents';

export function AdminEventsList() {
  const { currentLanguage } = useLanguage();

  const { data: eventsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match Event interface
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.categories?.name || '',
        category_id: event.category_id,
        start_date: event.start_date,
        end_date: event.end_date,
        price_range: event.price_range,
        venue_id: event.venue_id,
        image_url: event.image_url,
        status: event.status
      })) as Event[];
    }
  });

  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t('Pasākumu pārvaldība', 'Event Management')}
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('Pievienot pasākumu', 'Add Event')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Nosaukums', 'Title')}</TableHead>
              <TableHead>{t('Kategorija', 'Category')}</TableHead>
              <TableHead>{t('Datums', 'Date')}</TableHead>
              <TableHead>{t('Statuss', 'Status')}</TableHead>
              <TableHead>{t('Darbības', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventsData?.map((event: Event) => (
              <AdminEventRow key={event.id} event={event} onUpdate={refetch} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
