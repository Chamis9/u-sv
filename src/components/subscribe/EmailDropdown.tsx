
import React from "react";

interface EmailDropdownProps {
  showDropdown: boolean;
  previousEmails: string[];
  onEmailSelect: (email: string) => void;
}

export function EmailDropdown({ 
  showDropdown, 
  previousEmails, 
  onEmailSelect 
}: EmailDropdownProps) {
  if (!showDropdown || previousEmails.length === 0) {
    return null;
  }

  return (
    <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
      <ul className="py-1 max-h-60 overflow-auto">
        {previousEmails.map((email, index) => (
          <li 
            key={index}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => onEmailSelect(email)}
          >
            {email}
          </li>
        ))}
      </ul>
    </div>
  );
}
