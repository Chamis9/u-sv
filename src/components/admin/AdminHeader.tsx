
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Menu, UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function AdminHeader() {
  const isMobile = useIsMobile();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 bg-black/40 backdrop-blur-sm h-16">
      <div className="container mx-auto flex justify-between items-center">
        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Link 
              to="/admin" 
              className="flex items-center gap-2 font-semibold"
            >
              <span className="text-xl font-bold text-white">netieku.es</span>
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-white" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="flex items-center gap-2 font-semibold"
              >
                <span className="text-xl font-bold text-white">netieku.es</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2 py-0.5 rounded">
                  Admin
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6 text-white" />
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
