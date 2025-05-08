
import { UserTicket } from "@/hooks/tickets";

// Basic ticket interface
export interface Ticket extends UserTicket {
  // Additional fields can be added here if needed
}

// Seat information interface
export interface SeatInfo {
  row?: string;
  seat?: string;
  section?: string;
  [key: string]: string | undefined;
}
