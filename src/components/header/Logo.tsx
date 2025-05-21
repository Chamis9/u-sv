
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-2">
        {/* SellTiX text */}
        <span className="font-bold text-xl md:text-2xl text-orange-500">
          SellTiX
        </span>
      </div>
    </Link>
  );
}
