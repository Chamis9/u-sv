
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="text-2xl font-bold text-white hover:opacity-90 transition-opacity">
      <span className="text-orange-500">netieku</span>.es
    </Link>
  );
}
