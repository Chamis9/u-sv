
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useLanguage } from "@/features/language";
import { LanguageSelector } from "@/features/language";
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
      <SheetContent 
        side="left" 
        className="w-[280px] sm:w-[350px] bg-gradient-to-br from-orange-50 to-orange-100/80 border-none"
      >
        <div className="flex flex-col h-full backdrop-blur-sm">
          <div className="mb-6">
            <Logo className="text-black" />
          </div>
          
          <nav className="flex flex-col space-y-4 mb-8">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="px-2 py-3 text-lg font-medium text-black hover:bg-orange-200/50 rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-black">
                {translations.language?.label}
              </span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
