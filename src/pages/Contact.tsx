
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

  // Language-specific SEO
  const getSEOContent = () => {
    const seoContent = {
      lv: {
        title: `${t.title} | SellTiX`,
        description: "Sazinieties ar SellTiX komandu ar jautājumiem par biļešu apmaiņu vai citiem jautājumiem. Mēs esam šeit, lai palīdzētu!"
      },
      en: {
        title: `${t.title} | SellTiX`,
        description: "Contact the SellTiX team with questions about ticket exchange or other inquiries. We're here to help!"
      },
      et: {
        title: `${t.title} | SellTiX`,
        description: "Võtke ühendust SellTiX meeskonnaga küsimuste kohta piletite vahetuse või muude küsimuste kohta. Oleme siin, et aidata!"
      },
      lt: {
        title: `${t.title} | SellTiX`,
        description: "Susisiekite su SellTiX komanda dėl klausimų apie bilietų keitimąsi ar kitus klausimus. Mes čia, kad padėtume!"
      }
    };
    
    return seoContent[languageCode as keyof typeof seoContent] || seoContent.en;
  };

  const seoContent = getSEOContent();

  return (
    <>
      <SEO 
        title={seoContent.title}
        description={seoContent.description}
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
