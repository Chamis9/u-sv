
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
              {footer.madeWith} 
              <Heart 
                className="h-4 w-4 mx-1" 
                strokeWidth={2} 
                stroke="red" 
                fill="white" 
                fillRule="evenodd"
              />
              {footer.location}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
