
import React from "react";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Ticket as TicketIcon,
  Tag,
  Calendar,
  Clock,
  ShoppingBag,
  PlusCircle,
  Trash2
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useTickets } from "@/hooks/tickets"; // Updated import path
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from 'react-router-dom';

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const { currentLanguage } = useLanguage();
  const { userTickets, userPurchases, isLoadingUserTickets, isLoadingUserPurchases, deleteTicket } = useTickets();
  const queryClient = useQueryClient();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'sold':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return t('Aktīva', 'Active');
      case 'sold':
        return t('Pārdota', 'Sold');
      case 'cancelled':
        return t('Atcelta', 'Cancelled');
      default:
        return status;
    }
  };

  const renderListedTickets = () => {
    if (isLoadingUserTickets) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!userTickets.length) {
      return (
        <div className="text-center p-8">
          <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-2 text-lg font-medium">{t("Nav pievienotu biļešu", "No listed tickets")}</p>
          <p className="text-sm text-muted-foreground">{t("Jūs vēl neesat pievienojis nevienu biļeti pārdošanā", "You haven't listed any tickets for sale yet")}</p>
          <Link to="/events">
            <Button variant="outline" className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("Pievienot biļetes", "Add tickets")}
            </Button>
          </Link>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Notikums", "Event")}</TableHead>
            <TableHead>{t("Cena", "Price")}</TableHead>
            <TableHead>{t("Datums", "Date")}</TableHead>
            <TableHead>{t("Statuss", "Status")}</TableHead>
            <TableHead>{t("Darbības", "Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">
                Event ID: {ticket.event_id.substring(0, 8)}...
              </TableCell>
              <TableCell>€{ticket.price.toFixed(2)}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(ticket.status)} variant="outline">
                  {getStatusText(ticket.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {ticket.status === 'available' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t("Dzēst", "Delete")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("Vai tiešām vēlaties dzēst šo biļeti?", "Are you sure you want to delete this ticket?")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("Šī darbība nevar tikt atcelta. Biļete tiks neatgriezeniski dzēsta no sistēmas.", 
                            "This action cannot be undone. The ticket will be permanently deleted from the system.")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("Atcelt", "Cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTicket.mutate(ticket.id)}>
                          {t("Dzēst", "Delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  const renderPurchasedTickets = () => {
    if (isLoadingUserPurchases) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!userPurchases.length) {
      return (
        <div className="text-center p-8">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-2 text-lg font-medium">{t("Nav iegādātu biļešu", "No purchased tickets")}</p>
          <p className="text-sm text-muted-foreground">{t("Jūs vēl neesat iegādājies nevienu biļeti", "You haven't purchased any tickets yet")}</p>
          <Link to="/events">
            <Button variant="outline" className="mt-4">
              {t("Atrast pasākumus", "Find events")}
            </Button>
          </Link>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Notikums", "Event")}</TableHead>
            <TableHead>{t("Cena", "Price")}</TableHead>
            <TableHead>{t("Iegādes datums", "Purchase date")}</TableHead>
            <TableHead>{t("Statuss", "Status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userPurchases.map((purchase: any) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">
                Event ID: {purchase.tickets.event_id.substring(0, 8)}...
              </TableCell>
              <TableCell>€{purchase.tickets.price.toFixed(2)}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(purchase.purchase_date), { addSuffix: true })}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {t("Iegādāta", "Purchased")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Manas biļetes", "My Tickets")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="listed">
          <TabsList className="mb-4">
            <TabsTrigger value="listed">
              {t("Pievienotās biļetes", "Listed Tickets")}
            </TabsTrigger>
            <TabsTrigger value="purchased">
              {t("Iegādātās biļetes", "Purchased Tickets")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listed">
            {renderListedTickets()}
          </TabsContent>
          
          <TabsContent value="purchased">
            {renderPurchasedTickets()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
