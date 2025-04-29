
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

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
            {events?.map((event: Event) => (
              <AdminEventRow key={event.id} event={event} onUpdate={refetch} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdminEventsList;
