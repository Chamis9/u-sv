
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash } from 'lucide-react';
import { UserTicket } from '@/hooks/tickets';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useLanguage } from '@/features/language';
import { useTicketById } from '@/hooks/useTicketById';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdminTicketRowProps {
  ticket: UserTicket;
  onRefresh: () => void;
}

export function AdminTicketRow({ ticket, onRefresh }: AdminTicketRowProps) {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [showDetails, setShowDetails] = React.useState(false);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'sold':
        return 'bg-blue-500';
      case 'expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return t('Pieejama', 'Available');
      case 'sold':
        return t('Pārdota', 'Sold');
      case 'expired':
        return t('Beigusies', 'Expired');
      default:
        return status;
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticket.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t('Biļete dzēsta', 'Ticket deleted'),
        description: t('Biļete ir veiksmīgi dzēsta', 'The ticket has been successfully deleted'),
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        variant: 'destructive',
        title: t('Kļūda dzēšot biļeti', 'Error deleting ticket'),
        description: t('Lūdzu mēģiniet vēlreiz', 'Please try again'),
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell className="font-medium">{ticket.title}</TableCell>
        <TableCell>{ticket.category}</TableCell>
        <TableCell>{ticket.seller_name || '--'}</TableCell>
        <TableCell>{formatPrice(ticket.price)}</TableCell>
        <TableCell>{formatDate(ticket.created_at)}</TableCell>
        <TableCell>
          <Badge className={getStatusColor(ticket.status)}>
            {getStatusLabel(ticket.status)}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowDetails(true)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('Biļetes detaļas', 'Ticket Details')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">{t('Pamatinformācija', 'Basic Information')}</h3>
              <dl className="space-y-2">
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Nosaukums', 'Title')}</dt>
                  <dd>{ticket.title}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Apraksts', 'Description')}</dt>
                  <dd>{ticket.description || '-'}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Kategorija', 'Category')}</dt>
                  <dd>{ticket.category}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Cena', 'Price')}</dt>
                  <dd>{formatPrice(ticket.price)}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Daudzums', 'Quantity')}</dt>
                  <dd>{ticket.quantity}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Cena par vienību', 'Price per unit')}</dt>
                  <dd>{formatPrice(ticket.price_per_unit || ticket.price)}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold mb-1">{t('Papildinformācija', 'Additional Information')}</h3>
              <dl className="space-y-2">
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Statuss', 'Status')}</dt>
                  <dd>
                    <Badge className={getStatusColor(ticket.status)}>
                      {getStatusLabel(ticket.status)}
                    </Badge>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Pārdevējs', 'Seller')}</dt>
                  <dd>{ticket.seller_name || ticket.seller_id || '-'}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Pircējs', 'Buyer')}</dt>
                  <dd>{ticket.buyer_id || '-'}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Īpašnieks', 'Owner')}</dt>
                  <dd>{ticket.owner_id || '-'}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Izveidots', 'Created')}</dt>
                  <dd>{formatDate(ticket.created_at)}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{t('Faila ceļš', 'File path')}</dt>
                  <dd className="break-all">{ticket.file_path || '-'}</dd>
                </div>
              </dl>
            </div>
            {ticket.event_id && (
              <div className="col-span-2">
                <h3 className="font-semibold mb-1">{t('Pasākuma informācija', 'Event Information')}</h3>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500">{t('Pasākuma ID', 'Event ID')}</dt>
                    <dd>{ticket.event_id}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500">{t('Pasākuma datums', 'Event date')}</dt>
                    <dd>{ticket.event_date || '-'}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500">{t('Norises vieta', 'Venue')}</dt>
                    <dd>{ticket.venue || '-'}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500">{t('Norises laiks', 'Event time')}</dt>
                    <dd>{ticket.event_time || '-'}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
