
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
