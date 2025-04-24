
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/features/language";
import { LanguageSelector } from "@/features/language";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "./Logo";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { translations } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6 text-white" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-orange-50 dark:bg-gray-800 w-[280px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <nav className="flex flex-col space-y-4 mb-8">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="px-2 py-3 text-lg font-medium hover:bg-orange-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-col space-y-4 mt-auto mb-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium">{translations.theme?.label || "Theme"}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium">{translations.language?.label || "Language"}</span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
