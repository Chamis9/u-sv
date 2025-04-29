
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { SEO } from "@/components/SEO";
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/features/language";

const Index = () => {
  const { translations } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <SEO />
      <Header />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        
        <section className="bg-orange-100 dark:bg-gray-800 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-orange-800 dark:text-orange-300">
              {translations.hero.subscribeText}
            </h2>
            <div className="max-w-md mx-auto">
              <SubscribeForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
