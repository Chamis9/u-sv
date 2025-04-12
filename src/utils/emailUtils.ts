
// Regular expression for email validation
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Global storage key for all previously used emails across the app
export const GLOBAL_EMAILS_STORAGE_KEY = 'globalPreviousEmails';

/**
 * Validates an email address format
 */
export const validateEmail = (email: string): boolean => {
  if (!email || !EMAIL_REGEX.test(email)) {
    return false;
  }
  return true;
};

/**
 * Load previously used emails from localStorage
 */
export const loadSavedEmails = (): string[] => {
  try {
    const savedEmails = localStorage.getItem(GLOBAL_EMAILS_STORAGE_KEY);
    if (savedEmails) {
      return JSON.parse(savedEmails);
    }
  } catch (error) {
    console.error("Error loading saved emails:", error);
  }
  return [];
};

/**
 * Save email to localStorage and return updated email list
 */
export const saveEmailToLocalStorage = (emailToSave: string): string[] => {
  if (!emailToSave || emailToSave.trim() === '') return [];
  
  try {
    // Sanitize the email - only use validated emails that match the regex
    if (!EMAIL_REGEX.test(emailToSave)) return [];
    
    // Get any existing emails from global storage
    const existingEmails = localStorage.getItem(GLOBAL_EMAILS_STORAGE_KEY);
    const emailList = existingEmails ? JSON.parse(existingEmails) : [];
    
    // Create a new array with the new email at the beginning and remove duplicates
    const updatedEmails = [...new Set([emailToSave, ...emailList])].slice(0, 10); // Keep only last 10 unique emails
    
    // Save to global storage
    localStorage.setItem(GLOBAL_EMAILS_STORAGE_KEY, JSON.stringify(updatedEmails));
    
    return updatedEmails;
  } catch (error) {
    console.error("Error saving email to localStorage:", error);
    return [];
  }
};
