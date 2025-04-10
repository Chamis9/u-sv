
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
              <div className="relative mx-1">
                {/* Latvian flag colors with orange heart */}
                <Heart 
                  className="h-4 w-4" 
                  strokeWidth={0}
                  fill="#F97316" // Bright orange from tailwind color palette
                />
                <div className="absolute top-1/3 bottom-1/3 left-1/4 right-1/4 bg-white" />
              </div>
              {footer.location}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
