
import React, { useEffect, useState } from 'react';

interface Ticket {
  id: number;
  left: number;
  size: number;
  opacity: number;
  animationDuration: number;
  delay: number;
  rotation: number;
}

export function FallingTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Create tickets for animation
    const ticketCount = 15;
    const newTickets: Ticket[] = [];
    
    for (let i = 0; i < ticketCount; i++) {
      newTickets.push({
        id: i,
        left: Math.random() * 100, // Random horizontal position (%)
        size: Math.random() * 20 + 20, // Random size between 20px and 40px
        opacity: Math.random() * 0.5 + 0.3, // Random opacity
        animationDuration: Math.random() * 8 + 10, // Animation duration 10-18s
        delay: Math.random() * 15, // Random delay
        rotation: Math.random() * 360, // Random rotation
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
            width: `${ticket.size}px`,
            height: `${ticket.size * 1.6}px`, // Make tickets roughly rectangular
            opacity: ticket.opacity,
            animation: `fall ${ticket.animationDuration}s linear ${ticket.delay}s infinite`,
            transform: `rotate(${ticket.rotation}deg)`,
          }}
        >
          {/* Enhanced ticket design with perforation and "Biļete" text */}
          <div className="w-full h-full bg-orange-500/20 backdrop-blur-sm rounded-lg border border-orange-300/30 flex flex-col items-center justify-between p-1 overflow-hidden">
            <div className="w-full text-center text-[6px] font-bold text-orange-600 font-playfair">Biļete</div>
            <div className="w-3/4 h-[1px] border-b border-dashed border-orange-400/70" />
            <div className="w-full flex justify-between items-center">
              <div className="w-[4px] h-[4px] rounded-full bg-orange-300/60" />
              <div className="w-[4px] h-[4px] rounded-full bg-orange-300/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
