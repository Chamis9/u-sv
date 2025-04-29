
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/features/language";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Calendar, Ticket, Users, Mail, Search } from "lucide-react";

export const MobileMenu = () => {
  const { translations } = useLanguage();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>
            <Link to="/">
              <span className="text-lg font-bold text-orange-500">
                netieku.es
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-6">
          <SheetClose asChild>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-5 w-5" />
                {translations.navigation?.home || "Home"}
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/events">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-5 w-5" />
                {translations.navigation?.events || "Events"}
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/tickets">
              <Button variant="ghost" className="w-full justify-start">
                <Ticket className="mr-2 h-5 w-5" />
                {translations.navigation?.tickets || "Tickets"}
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/about-us">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-5 w-5" />
                {translations.navigation?.aboutUs || "About Us"}
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/contact">
              <Button variant="ghost" className="w-full justify-start">
                <Mail className="mr-2 h-5 w-5" />
                {translations.navigation?.contact || "Contact"}
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/ticket-search">
              <Button variant="ghost" className="w-full justify-start">
                <Search className="mr-2 h-5 w-5" />
                {translations.navigation?.search || "Search Ticket"}
              </Button>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
