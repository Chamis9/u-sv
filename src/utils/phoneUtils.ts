
import { supabase } from "@/integrations/supabase/client";

// Type definitions
export interface CountryCode {
  code: string;
  country: string;
  name: string;
  digits: number[];
  format: string;
}

// Country codes data
export const countryCodes: CountryCode[] = [
  { code: "+371", country: "LV", name: "Latvia", digits: [8], format: "XXXXXXXX" },
  { code: "+370", country: "LT", name: "Lithuania", digits: [8], format: "XXXXXXXX" },
  { code: "+372", country: "EE", name: "Estonia", digits: [7, 8], format: "XXXXXXX" },
  { code: "+1", country: "US", name: "United States", digits: [10], format: "XXX XXX XXXX" },
  { code: "+44", country: "GB", name: "United Kingdom", digits: [10], format: "XXXX XXXXXX" },
  { code: "+49", country: "DE", name: "Germany", digits: [10, 11], format: "XXXX XXXXXX" },
  { code: "+7", country: "RU", name: "Russia", digits: [10], format: "XXX XXX XXXX" },
  { code: "+358", country: "FI", name: "Finland", digits: [9], format: "XX XXX XXXX" },
  { code: "+46", country: "SE", name: "Sweden", digits: [9], format: "XX XXX XXXX" }
];

// Validation functions
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic validation: remove spaces and ensure we have at least one digit
  const digitsOnly = phone.replace(/\s/g, '');
  if (!digitsOnly) return false;
  
  // Check if the phone number matches any of the expected formats
  const currentCountry = countryCodes.find(c => digitsOnly.startsWith(c.code));
  if (!currentCountry) return false;
  
  // Get just the number part without the country code
  const numberPart = digitsOnly.substring(currentCountry.code.length);
  
  // Check if the length matches the expected digits for the country
  return currentCountry.digits.includes(numberPart.length);
};

// Formatting functions
export const formatPhoneNumber = (phone: string): string => {
  // Remove spaces and non-digit characters for consistent formatting
  return phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_email_exists', { check_email: email });
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    return false;
  }
};

export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_phone_exists', { check_phone: phone });
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if phone exists:", error);
    return false;
  }
};
