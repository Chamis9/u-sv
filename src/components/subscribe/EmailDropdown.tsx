
import React from "react";

interface EmailDropdownProps {
  show: boolean;
  emails: string[];
  currentEmail: string;
  onSelect: (email: string) => void;
  label: string;
}

export function EmailDropdown({ show, emails, currentEmail, onSelect, label }: EmailDropdownProps) {
  if (!show || emails.length === 0) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-orange-200/50">
      <div className="py-1 text-sm text-orange-700 font-playfair">
        {emails.map((email, index) => (
          <div 
            key={index} 
            className="px-4 py-2 hover:bg-orange-100/50 cursor-pointer"
            onClick={() => onSelect(email)}
            role="option"
            aria-selected={email === currentEmail}
          >
            {email}
          </div>
        ))}
      </div>
    </div>
  );
}
