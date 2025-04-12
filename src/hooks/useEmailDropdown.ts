
import { useState, useEffect } from 'react';
import { loadSavedEmails } from '@/utils/emailUtils';

export function useEmailDropdown() {
  const [email, setEmail] = useState("");
  const [previousEmails, setPreviousEmails] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Load previously used emails from localStorage on component mount
  useEffect(() => {
    const savedEmails = loadSavedEmails();
    setPreviousEmails(savedEmails);
  }, []);
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };
  
  const handleEmailSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowDropdown(false);
  };
  
  return {
    email,
    setEmail,
    previousEmails,
    setPreviousEmails,
    showDropdown,
    setShowDropdown,
    handleEmailChange,
    handleEmailSelect
  };
}
