
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} TicketSwap. Visas tiesības aizsargātas.
            </p>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center">
              Veidots ar <Heart className="h-4 w-4 mx-1 text-orange-500 fill-orange-500" /> Latvijā
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
