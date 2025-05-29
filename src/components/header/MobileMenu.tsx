
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useLanguage } from "@/features/language";

interface MobileMenuProps {
  onLinkClick?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onLinkClick }) => {
  const { currentLanguage, translations } = useLanguage();

  // Helper function to create language-prefixed paths
  const createPath = (path: string) => {
    return `/${currentLanguage.code}${path}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-orange-300">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="flex flex-col space-y-4 mt-8">
          <Link 
            to={createPath('/')} 
            className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-orange-500 transition-colors"
            onClick={onLinkClick}
          >
            {translations?.navigation?.home || "Home"}
          </Link>
          <Link 
            to={createPath('/tickets')} 
            className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-orange-500 transition-colors"
            onClick={onLinkClick}
          >
            {translations?.navigation?.tickets || "Tickets"}
          </Link>
          <Link 
            to={createPath('/about-us')} 
            className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-orange-500 transition-colors"
            onClick={onLinkClick}
          >
            {translations?.navigation?.aboutUs || "About Us"}
          </Link>
          <Link 
            to={createPath('/contact')} 
            className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-orange-500 transition-colors"
            onClick={onLinkClick}
          >
            {translations?.navigation?.contact || "Contact"}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
