
import React from "react";
import { PolicySection } from "./PolicySection";
import { PrivacyPolicyContent } from "@/features/language/privacyPolicyTranslations";

interface PolicyContentProps {
  content: PrivacyPolicyContent;
}

export const PolicyContent: React.FC<PolicyContentProps> = ({ content }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        <span className="text-orange-500">{content.title}</span>
      </h1>
      <p className="text-gray-300 text-sm mb-8">{content.lastUpdated}</p>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg mb-8 text-gray-300">{content.intro}</p>
        
        {content.sections.map((section, index) => (
          <PolicySection key={index} section={section} />
        ))}
      </div>
    </div>
  );
};
