
import React, { useEffect, useState } from 'react';

interface Ticket {
  id: number;
  left: number;
  size: number;
  opacity: number;
  animationDuration: number;
  delay: number;
  rotation: number;
  color: string;
}

export function FallingTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Create tickets for animation
    const ticketCount = 15;
    const newTickets: Ticket[] = [];
    
    // Ticket colors
    const colors = ['#F97316', '#FB923C', '#FD9B3B', '#FDBA74', '#FEC89A'];
    
    for (let i = 0; i < ticketCount; i++) {
      newTickets.push({
        id: i,
        left: Math.random() * 100, // Random horizontal position (%)
        size: Math.random() * 20 + 30, // Random size between 30px and 50px
        opacity: Math.random() * 0.5 + 0.3, // Random opacity
        animationDuration: Math.random() * 8 + 10, // Animation duration 10-18s
        delay: Math.random() * 15, // Random delay
        rotation: Math.random() * 360, // Random rotation
        color: colors[Math.floor(Math.random() * colors.length)], // Random color from the array
      });
    }

    setTickets(newTickets);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="absolute animate-fall"
          style={{
            left: `${ticket.left}%`,
            width: `${ticket.size * 2}px`,
            height: `${ticket.size}px`, // Make tickets rectangular (horizontal)
            opacity: ticket.opacity,
            animation: `fall ${ticket.animationDuration}s linear ${ticket.delay}s infinite`,
            transform: `rotate(${ticket.rotation}deg)`,
          }}
        >
          {/* Ticket container */}
          <div 
            className="relative w-full h-full rounded-md flex flex-col justify-between p-1 overflow-hidden backdrop-blur-sm"
            style={{ backgroundColor: `${ticket.color}30` }} // Using the ticket color with transparency
          >
            {/* Ticket content */}
            <div className="flex justify-between items-start w-full">
              <div className="w-1/3 h-2 bg-white/30 rounded-sm" />
              <div className="w-1/4 h-3 bg-white/40 rounded-full" />
            </div>
            
            {/* Center decorative element */}
            <div className="w-full flex justify-center items-center">
              <div className="w-3/4 h-1 border-b border-dashed border-white/50" />
            </div>
            
            {/* Bottom part */}
            <div className="flex justify-between items-end w-full">
              <div className="w-1/4 h-2 bg-white/30 rounded-sm" />
              <div className="w-1/5 h-2 bg-white/40 rounded-sm" />
            </div>
            
            {/* Perforated edge - left side */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white/50 rounded-full" />
              ))}
            </div>
            
            {/* Perforated edge - right side */}
            <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-evenly">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white/50 rounded-full" />
              ))}
            </div>
            
            {/* Ticket border */}
            <div className="absolute inset-0 border border-white/30 rounded-md pointer-events-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
