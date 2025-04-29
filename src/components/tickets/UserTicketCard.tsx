
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Ticket, useTickets } from "@/hooks/tickets";
import {
  TicketHeader,
  TicketDetails,
  TicketFileViewer,
  TicketFooter
} from "./components";

interface UserTicketCardProps {
  ticket: Ticket;
  onDelete?: () => void;
}

export function UserTicketCard({ ticket, onDelete }: UserTicketCardProps) {
  const { getTicketFile, deleteTicket } = useTickets();
  const event = (ticket as any).events;

  const handleDelete = async () => {
    await deleteTicket.mutateAsync(ticket.id);
    if (onDelete) onDelete();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <TicketHeader ticket={ticket} eventTitle={event?.title} />
      </CardHeader>
      <CardContent>
        <TicketDetails ticket={ticket} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <TicketFooter ticket={ticket} onDelete={handleDelete} />
        {ticket.file_path && (
          <TicketFileViewer 
            filePath={ticket.file_path} 
            getTicketFile={getTicketFile} 
          />
        )}
      </CardFooter>
    </Card>
  );
}
