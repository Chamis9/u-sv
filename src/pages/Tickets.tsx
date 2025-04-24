
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const Tickets = () => {
  return (
    <ThemeProvider defaultTheme="light" disableToggle={false}>
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <SEO />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Biļetes</h1>
          {/* Tickets content will be added here */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Tickets;
