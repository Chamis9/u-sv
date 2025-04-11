
import { LanguageSelector } from "@/features/language";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-orange-500">netieku</span>.es
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
