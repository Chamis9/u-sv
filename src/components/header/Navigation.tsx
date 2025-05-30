
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/features/language";

const Navigation = () => {
  const { currentLanguage, translations } = useLanguage();
  const location = useLocation();

  // Helper function to create language-prefixed paths
  const createPath = (path: string) => {
    return `/${currentLanguage.code}${path}`;
  };

  // Helper function to check if current path is active
  const isActive = (path: string) => {
    const fullPath = createPath(path);
    return location.pathname === fullPath || 
           (path !== '/' && location.pathname.startsWith(fullPath));
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        to={createPath('/')} 
        className={`transition-colors font-medium ${isActive('/') ? 'text-orange-500' : 'text-white hover:text-orange-300'}`}
      >
        {translations?.navigation?.home || "Home"}
      </Link>
      <Link 
        to={createPath('/tickets')} 
        className={`transition-colors font-medium ${isActive('/tickets') ? 'text-orange-500' : 'text-white hover:text-orange-300'}`}
      >
        {translations?.navigation?.tickets || "Tickets"}
      </Link>
      <Link 
        to={createPath('/about-us')} 
        className={`transition-colors font-medium ${isActive('/about-us') ? 'text-orange-500' : 'text-white hover:text-orange-300'}`}
      >
        {translations?.navigation?.aboutUs || "About Us"}
      </Link>
      <Link 
        to={createPath('/contact')} 
        className={`transition-colors font-medium ${isActive('/contact') ? 'text-orange-500' : 'text-white hover:text-orange-300'}`}
      >
        {translations?.navigation?.contact || "Contact"}
      </Link>
    </nav>
  );
};

export default Navigation;
