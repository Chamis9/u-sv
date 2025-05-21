
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2"
    >
      <span className="font-bold text-xl md:text-2xl text-orange-500">
        SellTiX
      </span>
    </Link>
  );
}
