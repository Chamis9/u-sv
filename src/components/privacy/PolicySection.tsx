
import React from "react";
import { PrivacyPolicySection } from "@/features/language/privacyPolicyTranslations";

interface PolicySectionProps {
  section: PrivacyPolicySection;
}

export const PolicySection: React.FC<PolicySectionProps> = ({ section }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-3 text-orange-500">
        {section.title}
      </h2>
      <p className="text-gray-300 mb-3">{section.content}</p>
      
      {section.list && section.list.length > 0 && (
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          {section.list.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      )}
      
      {section.additionalInfo && (
        <p className="text-gray-300 mt-3" dangerouslySetInnerHTML={{ __html: section.additionalInfo }} />
      )}
    </div>
  );
};
