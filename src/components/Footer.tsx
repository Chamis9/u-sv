
import { Heart, Cookie, Shield } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function Footer() {
  const { translations } = useLanguage();
  const { footer } = translations;

  const handleOpenCookieSettings = () => {
    if (window.openCookieSettings) {
      window.openCookieSettings();
    }
  };

  const handlePrivacyPolicyClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black py-8 px-4 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              {footer.allRightsReserved}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleOpenCookieSettings}
              className="text-gray-400 hover:text-orange-500"
            >
              <Cookie className="h-4 w-4 mr-2" />
              <span className="text-xs">{footer.cookieSettings}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-orange-500"
              asChild
            >
              <Link to="/privacy-policy" onClick={handlePrivacyPolicyClick}>
                <Shield className="h-4 w-4 mr-2" />
                <span className="text-xs">{footer.privacyPolicy}</span>
              </Link>
            </Button>
            <div className="flex items-center text-sm text-gray-400">
              <span className="flex items-center">
                {footer.madeWith} 
                <Heart 
                  className="mx-1 h-4 w-4" 
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
