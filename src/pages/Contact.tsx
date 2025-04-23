import React from "react";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/features/language";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const Contact = () => {
  const { currentLanguage } = useLanguage();
  return (
    <>
      <SEO 
        title="Kontakti | netieku.es"
        description=""
      />
      <ThemeProvider>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
          {/* Kontaktlapas saturs pārvietots uz footer */}
          <h1 className="text-3xl font-bold text-center">Šī lapa vairs nav aktīva</h1>
        </div>
      </ThemeProvider>
    </>
  );
};

export default Contact;
