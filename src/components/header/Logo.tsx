
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-1">
        {/* Blue ticket icon */}
        <div className="h-7 w-7 bg-blue-500 rounded-md relative overflow-hidden">
          {/* Ticket notch */}
          <div className="absolute w-3 h-6 rounded-full bg-black -right-1.5 top-0.5"></div>
        </div>
        
        {/* SellTiX text */}
        <span className="font-bold text-xl md:text-2xl text-ticket-text">
          SellTiX
        </span>
      </div>
    </Link>
  );
}
