
import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const Navigation = () => {
  const { translations } = useLanguage();

  return (
    <nav className="hidden md:flex space-x-4 items-center">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors hover:text-orange-500 ${
            isActive ? "text-orange-500" : "text-gray-900 dark:text-white"
          }`
        }
      >
        {translations.navigation?.home || "Home"}
      </NavLink>
      <NavLink
        to="/events"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors hover:text-orange-500 ${
            isActive ? "text-orange-500" : "text-gray-900 dark:text-white"
          }`
        }
      >
        {translations.navigation?.events || "Events"}
      </NavLink>
      <NavLink
        to="/tickets"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors hover:text-orange-500 ${
            isActive ? "text-orange-500" : "text-gray-900 dark:text-white"
          }`
        }
      >
        {translations.navigation?.tickets || "Tickets"}
      </NavLink>
      <NavLink
        to="/about-us"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors hover:text-orange-500 ${
            isActive ? "text-orange-500" : "text-gray-900 dark:text-white"
          }`
        }
      >
        {translations.navigation?.aboutUs || "About Us"}
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors hover:text-orange-500 ${
            isActive ? "text-orange-500" : "text-gray-900 dark:text-white"
          }`
        }
      >
        {translations.navigation?.contact || "Contact"}
      </NavLink>
      <NavLink
        to="/ticket-search"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors hover:text-orange-500 ${
            isActive ? "text-orange-500" : "text-gray-900 dark:text-white"
          }`
        }
      >
        <Button variant="ghost" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          {translations.navigation?.search || "Search"}
        </Button>
      </NavLink>
    </nav>
  );
};
