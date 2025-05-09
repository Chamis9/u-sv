
import { Landmark, Shield, Mail, Building2, Heart } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function Footer() {
  const { translations } = useLanguage();
  const { footer } = translations;

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-ticket-bg py-6 md:py-8 px-4 text-ticket-text/70 border-t border-ticket-text/10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-xs sm:text-sm text-ticket-text/70">
              {footer.allRightsReserved}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 sm:gap-4">
            <Link 
              to="/about-us"
              onClick={handleLinkClick}
              className="text-ticket-text/70 hover:text-ticket-accent transition-colors flex items-center gap-1 text-xs sm:text-sm"
            >
              <Landmark size={14} className="hidden sm:inline" />
              <span>{translations.navigation?.aboutUs || "Par mums"}</span>
            </Link>
            <Link 
              to="/contact" 
              onClick={handleLinkClick}
              className="text-ticket-text/70 hover:text-ticket-accent transition-colors flex items-center gap-1 text-xs sm:text-sm"
            >
              <Mail size={14} className="hidden sm:inline" />
              <span>{footer.contactLink || "Kontakti"}</span>
            </Link>
            <div className="flex items-center text-xs text-ticket-text/70">
              <span className="flex items-center whitespace-nowrap">
                {footer.madeWith} 
                <Heart 
                  className="mx-1 h-3 w-3 sm:h-4 sm:w-4" 
                  fill="#f7b731" 
                  strokeWidth={0}
                />
                {footer.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
