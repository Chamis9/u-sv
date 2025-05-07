
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

export function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-1.5">
        <Ticket 
          size={22} 
          className="text-ticket-accent" 
        />
        <span className="font-bold text-lg md:text-xl text-ticket-text">
          netieku.es
        </span>
      </div>
    </Link>
  );
}
