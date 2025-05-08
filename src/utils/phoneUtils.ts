
import { supabase } from "@/integrations/supabase/client";

/**
 * Country code type definition
 */
export interface CountryCode {
  name: string;
  country: string;
  code: string;
  digits: number[];
  format: string;
}

/**
 * List of country codes
 */
export const countryCodes: CountryCode[] = [
  { name: "Latvia", country: "lv", code: "+371", digits: [8], format: "XX XXX XXX" },
  { name: "Estonia", country: "ee", code: "+372", digits: [7, 8], format: "XXXX XXXX" },
  { name: "Lithuania", country: "lt", code: "+370", digits: [8], format: "XXX XX XXX" },
  { name: "United Kingdom", country: "gb", code: "+44", digits: [10], format: "XXXX XXXXXX" },
  { name: "United States", country: "us", code: "+1", digits: [10], format: "(XXX) XXX-XXXX" },
  { name: "Russia", country: "ru", code: "+7", digits: [10], format: "XXX XXX-XX-XX" },
  { name: "Germany", country: "de", code: "+49", digits: [10, 11], format: "XXXX XXXXXX" },
  { name: "Sweden", country: "se", code: "+46", digits: [9], format: "XXX-XXX XXX" },
  { name: "Finland", country: "fi", code: "+358", digits: [9], format: "XXX XXX XXXX" },
  { name: "Norway", country: "no", code: "+47", digits: [8], format: "XXX XX XXX" },
  { name: "Poland", country: "pl", code: "+48", digits: [9], format: "XXX XXX XXX" },
  { name: "Belarus", country: "by", code: "+375", digits: [9], format: "XX XXX-XX-XX" },
  { name: "Ukraine", country: "ua", code: "+380", digits: [9], format: "XX XXX XXXX" },
  { name: "France", country: "fr", code: "+33", digits: [9], format: "X XX XX XX XX" },
];

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
