
import { Dispatch, SetStateAction } from 'react';

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
  if (!showDropdown || previousEmails.length === 0) return null;

  // Stop propagation for all events in the dropdown
  const stopPropagation = (e: React.MouseEvent | React.FocusEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-orange-200/50"
      onClick={stopPropagation}
      onFocus={stopPropagation}
    >
      <div className="py-1 text-sm text-orange-700 font-playfair">
        {previousEmails.map((prevEmail, index) => (
          <div 
            key={index} 
            className="px-4 py-2 hover:bg-orange-100/50 cursor-pointer dropdown-option"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEmailSelect(prevEmail);
            }}
            onMouseDown={(e) => {
              // Prevent blur event from triggering on input
              e.preventDefault();
              e.stopPropagation();
            }}
            role="option"
          >
            {prevEmail}
          </div>
        ))}
      </div>
    </div>
  );
}
