
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/features/language";
import { Home } from "lucide-react";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:opacity-90 transition-opacity">
            <span className="text-orange-500">netieku</span>.es
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
