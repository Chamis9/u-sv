
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/features/language";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";
import { contactTranslations } from "@/features/language/translations";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const Contact = () => {
  const { currentLanguage } = useLanguage();
  // For Estonian route /ee/, use Estonian translations (et)
  const languageCode = currentLanguage.code === 'ee' ? 'et' : currentLanguage.code;
  const t = contactTranslations[languageCode] || contactTranslations.en;

  return (
    <>
      <SEO 
        title={`${t.title} | selltix.eu`}
        description="Sazinieties ar SellTiX komandu ar jautājumiem par biļešu apmaiņu vai citiem jautājumiem."
      />
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-ticket-bg text-ticket-text">
          <Header />
          
          <main className="flex-grow pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-ticket-accent">{t.title}</span>
                </h1>
                <p className="text-xl mb-12 text-ticket-text/80">{t.subtitle}</p>

                <div className="grid md:grid-cols-2 gap-12">
                  <ContactInfo translations={t} />
                  <ContactForm translations={t} />
                </div>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
};

export default Contact;
