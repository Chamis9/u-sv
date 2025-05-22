
import { Link } from "react-router-dom";
import { useLanguage } from "@/features/language";
import { Search, Ticket } from "lucide-react";

export function Navigation() {
  const { translations } = useLanguage();
  
  const navigationLinks = [
    { href: "/", label: translations?.navigation?.home || "Home" },
    { href: "/events", label: translations?.navigation?.events || "Events" },
    { href: "/contact", label: translations?.navigation?.contact || "Contact" }
  ];
  
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navigationLinks.map((link, index) => (
        <Link
          key={index}
          to={link.href}
          className="text-sm font-medium text-white hover:text-orange-200 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export const getNavigationLinks = () => {
  const { translations } = useLanguage();
  
  return [
    { href: "/", label: translations?.navigation?.home || "Home" },
    { href: "/events", label: translations?.navigation?.events || "Events" },
    { href: "/contact", label: translations?.navigation?.contact || "Contact" }
  ];
};
