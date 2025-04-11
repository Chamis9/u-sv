
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PolicyContent } from "@/components/privacy/PolicyContent";
import { usePrivacyPolicy } from "@/hooks/use-privacy-policy";

const PrivacyPolicy = () => {
  const content = usePrivacyPolicy();

  return (
    <>
      <SEO 
        title={`${content.title} | netieku.es`}
        description={content.intro}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
        <Header />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <PolicyContent content={content} />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
