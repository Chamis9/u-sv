
// Country codes for phone numbers
export interface CountryCode {
  code: string;
  country: string;
  name: string;
  format: string;
  digits: number[];
}

export const countryCodes: CountryCode[] = [
  { code: "+371", country: "lv", name: "Latvija", format: "+371 XXXXXXXX", digits: [8] },
  { code: "+370", country: "lt", name: "Lietuva", format: "+370 XXXXXXXX", digits: [8] },
  { code: "+372", country: "ee", name: "Igaunija", format: "+372 XXXXXXXX", digits: [7, 8] },
  { code: "+48", country: "pl", name: "Polija", format: "+48 XXXXXXXXX", digits: [9] },
  { code: "+380", country: "ua", name: "Ukraina", format: "+380 XX XXX XXXX", digits: [9] },
  { code: "+1", country: "us", name: "ASV", format: "+1 XXX XXX XXXX", digits: [10] },
  { code: "+44", country: "gb", name: "Lielbritānija", format: "+44 XXXX XXXXXX", digits: [10] },
  { code: "+49", country: "de", name: "Vācija", format: "+49 XXXX XXXXXX", digits: [10, 11] },
  { code: "+33", country: "fr", name: "Francija", format: "+33 X XX XX XX XX", digits: [9] },
  { code: "+46", country: "se", name: "Zviedrija", format: "+46 XX XXX XXXX", digits: [9] },
  { code: "+358", country: "fi", name: "Somija", format: "+358 XX XXX XXXX", digits: [9] },
  { code: "+47", country: "no", name: "Norvēģija", format: "+47 XXX XX XXX", digits: [8] },
  { code: "+45", country: "dk", name: "Dānija", format: "+45 XXXX XXXX", digits: [8] },
  { code: "+31", country: "nl", name: "Nīderlande", format: "+31 XX XXX XXXX", digits: [9] },
  { code: "+32", country: "be", name: "Beļģija", format: "+32 XXX XX XX XX", digits: [9] },
  { code: "+39", country: "it", name: "Itālija", format: "+39 XXX XXX XXXX", digits: [10] },
  { code: "+34", country: "es", name: "Spānija", format: "+34 XXX XXX XXX", digits: [9] },
  { code: "+351", country: "pt", name: "Portugāle", format: "+351 XXX XXX XXX", digits: [9] },
  { code: "+43", country: "at", name: "Austrija", format: "+43 XXX XXXXXX", digits: [9] },
  { code: "+41", country: "ch", name: "Šveice", format: "+41 XX XXX XXXX", digits: [9] },
  { code: "+420", country: "cz", name: "Čehija", format: "+420 XXX XXX XXX", digits: [9] },
  { code: "+421", country: "sk", name: "Slovākija", format: "+421 XXX XXX XXX", digits: [9] },
  { code: "+36", country: "hu", name: "Ungārija", format: "+36 XX XXX XXXX", digits: [9] }
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
export const validatePhoneNumber = (phoneNumber: string, countryCode: string): boolean => {
  if (!phoneNumber) return false;
  
  const digits = phoneNumber.replace(/\D/g, '');
  const country = findCountryByCode(countryCode);
  
  if (!country) return false;
  
  return country.digits.includes(digits.length);
};

// Format a raw phone number for display
export const formatPhoneNumber = (countryCode: string, phoneNumber: string): string => {
  if (!phoneNumber) return countryCode;
  return `${countryCode} ${phoneNumber}`;
};

// Extract phone components (country code and number)
export const extractPhoneComponents = (fullPhone: string | null): { 
  countryCode: string; 
  phoneNumber: string 
} => {
  if (!fullPhone) return { countryCode: "+371", phoneNumber: "" };
  
  // Try to find country code
  for (const country of countryCodes) {
    if (fullPhone.startsWith(country.code)) {
      return {
        countryCode: country.code,
        phoneNumber: fullPhone.substring(country.code.length).trim()
      };
    }
  }
  
  // Default to Latvia if no match
  return { countryCode: "+371", phoneNumber: fullPhone };
};

// Helper function to convert country code to flag emoji
export const getCountryFlag = (country: string): string => {
  const countryToFlag: { [key: string]: string } = {
    "Latvija": "🇱🇻",
    "Lietuva": "🇱🇹",
    "Igaunija": "🇪🇪",
    "Polija": "🇵🇱",
    "Ukraina": "🇺🇦",
    "ASV / Kanāda": "🇺🇸",
    "Lielbritānija": "🇬🇧",
    "Vācija": "🇩🇪",
    "Francija": "🇫🇷",
    "Zviedrija": "🇸🇪",
    "Somija": "🇫🇮",
    "Norvēģija": "🇳🇴"
  };
  return countryToFlag[country] || "🏳️";
};
