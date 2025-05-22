
import React from 'react';
import { Check, Ticket } from "lucide-react";

export interface TicketVerifyIconProps {
  size?: number;
  className?: string;
}

export const TicketVerifyIcon: React.FC<TicketVerifyIconProps> = ({ 
  size = 120,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-ticket-accent border-4 border-ticket-text/20 flex items-center justify-center">
        <Ticket 
          size={size * 0.6} 
          className="text-ticket-check" 
          strokeWidth={2}
        />
      </div>
      <div className="absolute bottom-0 right-0 bg-ticket-checkbg rounded-full border-4 border-ticket-text/20 flex items-center justify-center" style={{ width: size * 0.5, height: size * 0.5 }}>
        <Check 
          size={size * 0.3} 
          className="text-ticket-check" 
          strokeWidth={3}
        />
      </div>
    </div>
  );
};
