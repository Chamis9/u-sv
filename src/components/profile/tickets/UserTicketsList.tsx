
import React from 'react';
import { Ticket, Calendar, Download, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";
import { useUserTickets } from '@/hooks/useUserTickets';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const UserTicketsList: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { userTickets, isLoadingUser, deleteTicket } = useUserTickets();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  const handleDownload = (url: string, title: string) => {
    if (!url) return;
    
    // Create a temporary anchor tag to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteTicket.mutateAsync(id);
      toast({
        title: t('Biļete dzēsta', 'Ticket deleted'),
        description: t('Biļete veiksmīgi dzēsta', 'Ticket was successfully deleted'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās dzēst biļeti', 'Failed to delete ticket'),
      });
    }
  };
  
  if (isLoadingUser) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!userTickets?.length) {
    return (
      <div className="text-center py-12">
        <Ticket className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">
          {t('Nav pievienotu biļešu', 'No tickets added')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('Jūs vēl neesat pievienojis nevienu biļeti', 'You have not added any tickets yet')}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {userTickets.map((ticket) => (
        <Card key={ticket.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {ticket.image_url && (
              <div className="md:w-1/4">
                <img
                  src={ticket.image_url}
                  alt={ticket.title}
                  className="h-full w-full object-cover md:max-h-[200px]"
                />
              </div>
            )}
            <div className={`flex-1 ${ticket.image_url ? 'md:w-3/4' : 'w-full'}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{ticket.title}</CardTitle>
                    <CardDescription>
                      <Badge className="mt-1">{ticket.category}</Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{ticket.price} €</div>
                    <div className="text-sm text-muted-foreground">
                      {t('Skaits', 'Quantity')}: {ticket.quantity}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {ticket.description && (
                  <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                )}
                {ticket.event_date && (
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(ticket.event_date), 'PPP')}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    disabled={!ticket.file_path}
                    onClick={() => handleDownload(ticket.file_path || '', ticket.title)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t('Lejupielādēt', 'Download')}
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(ticket.id)}
                  disabled={deleteTicket.isPending}
                >
                  {deleteTicket.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Trash className="mr-2 h-4 w-4" />
                      {t('Dzēst', 'Delete')}
                    </>
                  )}
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserTicketsList;
