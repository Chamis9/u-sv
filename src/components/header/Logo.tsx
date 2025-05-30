
import { Link } from "react-router-dom";
import { useLanguage } from "@/features/language";

export function Logo() {
  const { currentLanguage } = useLanguage();

  // Create language-prefixed path for home
  const homePath = `/${currentLanguage.code}`;

  return (
    <Link 
      to={homePath} 
      className="flex items-center gap-2"
    >
      <span className="font-bold text-xl md:text-2xl text-orange-500">
        SellTiX
      </span>
    </Link>
  );
}
