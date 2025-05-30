
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/features/language';

interface AdminEventRowProps {
  event: Event;
  onUpdate: () => void;
}

export function AdminEventRow({ event, onUpdate }: AdminEventRowProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatEventDate = (date: string) => {
    return format(new Date(date), 'dd.MM.yyyy HH:mm');
  };

  return (
    <TableRow>
      <TableCell>{event.title}</TableCell>
      <TableCell>{event.category}</TableCell>
      <TableCell>{formatEventDate(event.start_date)}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(event.status)}>
          {t(
            event.status === 'published' ? 'Publicēts' :
            event.status === 'draft' ? 'Melnraksts' :
            event.status === 'cancelled' ? 'Atcelts' : 'Nezināms',
            event.status || 'Unknown'
          )}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
