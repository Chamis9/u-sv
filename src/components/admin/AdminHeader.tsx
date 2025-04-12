
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLanguage } from "@/features/language";

export function AdminHeader() {
  const { translations } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link 
          to="/admin" 
          className="flex items-center gap-2 font-semibold"
        >
          <span className="text-xl font-bold">netieku.es</span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2 py-0.5 rounded">
            Admin
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Paziņojumi</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
