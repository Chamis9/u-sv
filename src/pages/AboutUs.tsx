
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";

const AboutUs = () => {
  const { translations } = useLanguage();
  
  return (
    <ThemeProvider defaultTheme="light" disableToggle={false}>
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <SEO />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <section className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 dark:text-white">
              {translations.aboutUs?.title}
            </h1>
            <div className="prose dark:prose-invert max-w-none">
              {translations.aboutUs?.content.map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-600 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default AboutUs;
