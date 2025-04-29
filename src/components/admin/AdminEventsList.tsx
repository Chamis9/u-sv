
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/features/language';
import { AdminEventRow } from './events/AdminEventRow';
import { useEvents } from '@/hooks/useEvents';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminEventsList() {
  const { currentLanguage } = useLanguage();
  const { data: eventsData, isLoading } = useEvents();

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : eventsData && eventsData.length > 0 ? (
              eventsData.map((event) => (
                <AdminEventRow key={event.id} event={event} onUpdate={() => {}} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {t('Nav atrasts neviens pasākums', 'No events found')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
