
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/features/language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { languages } from "@/features/language/languages";

const translations = {
  footer: {
    about: "footer.about",
    privacyPolicy: "footer.privacyPolicy",
    subscribe: "footer.subscribe",
    emailPlaceholder: "footer.emailPlaceholder",
    subscribeButton: "footer.subscribeButton",
    followUs: "footer.followUs",
  },
  navigation: {
    home: "navigation.home",
    events: "navigation.events",
    tickets: "navigation.tickets",
    about: "navigation.about",
    contact: "navigation.contact",
    docs: "navigation.docs",
  },
};

export function Footer() {
  const { currentLanguage, setLanguage } = useLanguage();
  
  // Create a translation function that doesn't depend on react-i18next
  const t = (key: string) => {
    // Basic implementation that returns the key for demonstration
    // In a real app, you'd have a more sophisticated translation system
    const translations: Record<string, Record<string, string>> = {
      "lv": {
        "footer.about": "Par mums",
        "footer.privacyPolicy": "Privātuma politika",
        "footer.subscribe": "Pierakstīties jaunumiem",
        "footer.emailPlaceholder": "Jūsu e-pasts",
        "footer.subscribeButton": "Abonēt",
        "footer.followUs": "Sekojiet mums",
        "navigation.home": "Sākums",
        "navigation.events": "Pasākumi",
        "navigation.tickets": "Biļetes",
        "navigation.about": "Par mums",
        "navigation.contact": "Kontakti",
        "navigation.docs": "Dokumentācija"
      },
      "en": {
        "footer.about": "About Us",
        "footer.privacyPolicy": "Privacy Policy",
        "footer.subscribe": "Subscribe to updates",
        "footer.emailPlaceholder": "Your email",
        "footer.subscribeButton": "Subscribe",
        "footer.followUs": "Follow Us",
        "navigation.home": "Home",
        "navigation.events": "Events",
        "navigation.tickets": "Tickets",
        "navigation.about": "About Us",
        "navigation.contact": "Contact",
        "navigation.docs": "Documentation"
      }
    };
    
    return translations[currentLanguage.code]?.[key] || key;
  };

  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t(translations.footer.about)}</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition">
                {t(translations.navigation.about)}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition">
                {t(translations.navigation.contact)}
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition">
                {t(translations.footer.privacyPolicy)}
              </Link>
            </li>
            <li>
              <Link to="/docs" className="text-muted-foreground hover:text-foreground transition">
                {t(translations.navigation.docs)}
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t(translations.footer.subscribe)}</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input type="email" placeholder={t(translations.footer.emailPlaceholder)} className="w-full sm:w-auto" />
            <Button>{t(translations.footer.subscribeButton)}</Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t(translations.footer.followUs)}</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-foreground transition">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-foreground transition">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Language</h3>
          <select
            className="bg-background border border-input rounded-md px-4 py-2 text-sm"
            value={currentLanguage.code}
            onChange={(e) => {
              const selectedLanguage = languages.find((lang) => lang.code === e.target.value);
              if (selectedLanguage) {
                setLanguage(selectedLanguage);
              }
            }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 text-center text-muted-foreground border-t pt-4">
        © {new Date().getFullYear()} netieku.es. All rights reserved.
      </div>
    </footer>
  );
}
