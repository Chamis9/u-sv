
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { SEO } from "@/components/SEO";
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/features/language";

const Index = () => {
  const { translations } = useLanguage();
  const { hero } = translations;

  return (
    <div className="min-h-screen flex flex-col bg-ticket-bg text-ticket-text">
      <SEO />
      <Header />
      <main className="flex-grow pt-4">
        {/* Subscribe Section */}
        <section className="py-10 px-4 bg-ticket-bg text-ticket-text">
          <div className="container mx-auto text-center">
            <div className="flex flex-col items-center space-y-6 bg-ticket-accent/10 dark:bg-ticket-accent/5 rounded-xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto border border-ticket-text/10">
              <p className="text-ticket-text text-lg md:text-xl">
                {hero.subscribeText}
              </p>
              <div className="w-full max-w-md mx-auto">
                <SubscribeForm />
              </div>
            </div>
          </div>
        </section>
        
        <Hero />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
