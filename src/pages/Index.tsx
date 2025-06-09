
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ticket-bg text-ticket-text">
      <SEO />
      <Header />
      <main className="flex-grow pt-4">
        <HowItWorks />
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
