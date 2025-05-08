
import { supabase } from "@/integrations/supabase/client";

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (8 digits for Latvian numbers)
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const cleanedNumber = phoneNumber.replace(/\s/g, '');
  return /^\d{8}$/.test(cleanedNumber);
};

/**
 * Format phone number with spaces
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanedNumber = phoneNumber.replace(/\s/g, '');
  
  if (cleanedNumber.length === 8) {
    // Format as XX XX XXXX
    return `${cleanedNumber.substring(0, 2)} ${cleanedNumber.substring(2, 4)} ${cleanedNumber.substring(4)}`;
  }
  
  return phoneNumber;
};

/**
 * Check if email exists in the database
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_email_exists', {
      check_email: email
    });
    
    if (error) {
      console.error('Error checking email:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

/**
 * Check if phone exists in the database
 */
export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_phone_exists', {
      check_phone: phone
    });
    
    if (error) {
      console.error('Error checking phone:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking phone:', error);
    return false;
  }
};
