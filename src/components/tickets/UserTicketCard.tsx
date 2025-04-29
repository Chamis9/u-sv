
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileIcon, Eye, Trash2 } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Ticket, useTickets } from "@/hooks/tickets"; // Updated import path
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface UserTicketCardProps {
  ticket: Ticket;
  onDelete?: () => void;
}

export function UserTicketCard({ ticket, onDelete }: UserTicketCardProps) {
  const { currentLanguage } = useLanguage();
  const { getTicketFile, deleteTicket } = useTickets();
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);

  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const event = (ticket as any).events;

  const handleViewFile = async () => {
    if (!ticket.file_path) return;
    
    setLoading(true);
    try {
      const url = await getTicketFile(ticket.file_path);
      if (url) {
        setFileUrl(url);
        setFileDialogOpen(true);
      }
    } catch (error) {
      console.error('Error getting ticket file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm(t('Vai tiešām vēlaties dzēst šo biļeti?', 'Are you sure you want to delete this ticket?'))) {
      await deleteTicket.mutateAsync(ticket.id);
      if (onDelete) onDelete();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{event?.title || t('Biļete', 'Ticket')}</span>
          <span className="text-orange-500">€{ticket.price.toFixed(2)}</span>
        </CardTitle>
        {event && (
          <CardDescription className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {formatDate(event.start_date)}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {ticket.seat_info && (
          <div className="mb-2">
            <strong>{t('Sēdvieta:', 'Seat:')}</strong> {ticket.seat_info}
          </div>
        )}
        {ticket.description && (
          <div>
            <strong>{t('Apraksts:', 'Description:')}</strong> {ticket.description}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {t('Pievienota:', 'Added:')} {formatDate(ticket.created_at)}
        </div>
        <div className="space-x-2">
          {ticket.file_path && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewFile}
                disabled={loading}
              >
                <Eye className="h-4 w-4 mr-1" />
                {t('Skatīt failu', 'View file')}
              </Button>
              
              <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{t('Biļetes fails', 'Ticket file')}</DialogTitle>
                  </DialogHeader>
                  <Separator className="my-2" />
                  <div className="max-h-[70vh] overflow-auto">
                    {fileUrl && (
                      fileUrl.toLowerCase().endsWith('.pdf') ? (
                        <iframe 
                          src={fileUrl} 
                          className="w-full h-[600px]" 
                          title="Ticket PDF"
                        />
                      ) : (
                        <img 
                          src={fileUrl} 
                          alt="Ticket" 
                          className="w-full h-auto max-h-[600px] object-contain"
                        />
                      )
                    )}
                  </div>
                  <div className="flex justify-center mt-2">
                    <Button onClick={() => window.open(fileUrl || '', '_blank')}>
                      {t('Atvērt pilnā izmērā', 'Open full size')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteTicket}
            disabled={deleteTicket.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t('Dzēst', 'Delete')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
