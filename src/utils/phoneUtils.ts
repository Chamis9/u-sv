
export interface CountryCode {
  code: string;
  country: string;
  name: string;
  format: string;
  digits: number[];
}

export const countryCodes: CountryCode[] = [
  { code: "+371", country: "lv", name: "Latvija", format: "+371 XXXXXXXX", digits: [8] }
];

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Find country by code
export const findCountryByCode = (code: string): CountryCode | undefined => {
  return countryCodes.find(country => country.code === code);
};

// Find country by name (case insensitive search)
export const findCountriesByName = (name: string): CountryCode[] => {
  const lowerName = name.toLowerCase();
  return countryCodes.filter(country => 
    country.country.toLowerCase().includes(lowerName)
  );
};

// Validate phone number based on country code
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;
  const digits = phoneNumber.replace(/\D/g, '');
  return digits.length === 8;
};

// Format a raw phone number for display
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "+371";
  return phoneNumber.startsWith("+371") ? phoneNumber : `+371 ${phoneNumber}`;
};

// Extract phone components (country code and number)
export const extractPhoneComponents = (fullPhone: string | null): { 
  phoneNumber: string 
} => {
  if (!fullPhone) return { phoneNumber: "" };
  
  return {
    phoneNumber: fullPhone.startsWith("+371") ? fullPhone.substring(5).trim() : fullPhone.trim()
  };
};

// Check if email already exists in database
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data, error } = await supabase
      .from('registered_users')
      .select('email')
      .eq('email', email)
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0;
  } catch (err) {
    console.error("Error checking email:", err);
    return false;
  }
};

// Check if phone already exists in database
export const checkPhoneExists = async (fullPhone: string): Promise<boolean> => {
  if (!fullPhone) return false;
  
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data, error } = await supabase
      .from('registered_users')
      .select('phone')
      .eq('phone', fullPhone)
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0;
  } catch (err) {
    console.error("Error checking phone:", err);
    return false;
  }
};
