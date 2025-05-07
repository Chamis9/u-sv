
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
    <footer className="bg-gradient-to-b from-gray-900 to-black py-6 md:py-8 px-4 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-xs sm:text-sm text-gray-400">
              {footer.allRightsReserved}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 sm:gap-4">
            <Link 
              to="/about-us"
              onClick={handleLinkClick}
              className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1 text-xs sm:text-sm"
            >
              <Landmark size={14} className="hidden sm:inline" />
              <span>{translations.navigation?.aboutUs || "Par mums"}</span>
            </Link>
            <Link 
              to="/contact" 
              onClick={handleLinkClick}
              className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1 text-xs sm:text-sm"
            >
              <Mail size={14} className="hidden sm:inline" />
              <span>{footer.contactLink || "Kontakti"}</span>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1 h-7 px-2 text-xs bg-transparent hover:bg-transparent"
              asChild
            >
              <Link to="/privacy-policy" onClick={handleLinkClick}>
                <Shield className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                <span>{footer.privacyPolicy}</span>
              </Link>
            </Button>
            <div className="hidden sm:flex items-center text-xs sm:text-sm text-gray-400">
              <span className="flex items-center">
                {footer.madeWith} 
                <Heart 
                  className="mx-1 h-3 w-3 sm:h-4 sm:w-4" 
                  fill="#F97316" 
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
