
import React from "react";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/features/language";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { contactTranslations } from "@/features/language/translations/features";

const Contact = () => {
  const { currentLanguage } = useLanguage();
  const contactT = contactTranslations[currentLanguage.code];
  
  return (
    <>
      <SEO 
        title={`${contactT.title} | netieku.es`}
        description={contactT.subtitle}
      />
      <ThemeProvider>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{contactT.title}</h1>
            <p className="text-xl">{contactT.subtitle}</p>
            <p className="mt-8 text-lg text-gray-600 dark:text-gray-400">
              Lai sazinātos ar mums, lūdzu, skatiet kontaktinformāciju lapas apakšā (Footer sadaļā).
            </p>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default Contact;
