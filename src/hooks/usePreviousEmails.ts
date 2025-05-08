
import { useState, useEffect } from 'react';

export function usePreviousEmails() {
  const [previousEmails, setPreviousEmails] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load previous emails from localStorage on mount
  useEffect(() => {
    const savedEmails = localStorage.getItem('globalPreviousEmails');
    if (savedEmails) {
      try {
        const emails = JSON.parse(savedEmails);
        if (Array.isArray(emails)) {
          setPreviousEmails(emails);
        }
      } catch (error) {
        console.error('Error parsing saved emails:', error);
        // Reset if there's an error
        localStorage.removeItem('globalPreviousEmails');
      }
    }
  }, []);

  return {
    previousEmails,
    setPreviousEmails,
    showDropdown,
    setShowDropdown
  };
}
