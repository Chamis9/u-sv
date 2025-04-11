
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link 
      to="/" 
      className="text-2xl font-bold text-white hover:opacity-90 transition-opacity relative z-10"
    >
      <span className="text-orange-500">netieku</span>.es
    </Link>
  );
}
