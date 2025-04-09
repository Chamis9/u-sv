
import { Heart } from "lucide-react";
import { useLanguage } from "@/components/LanguageSelector";

export function Footer() {
  const { translations } = useLanguage();
  const { footer } = translations;

  return (
    <footer className="bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} netieku.es. {footer.allRightsReserved}
            </p>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="flex items-center">
              {footer.madeWith} <Heart className="h-4 w-4 mx-1 text-orange-500 fill-orange-500" /> Latvijā
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {footer.c2cExplanation}
          </p>
        </div>
      </div>
    </footer>
  );
}
