// Country codes for phone numbers
export interface CountryCode {
  code: string;
  country: string;
  format: string;
  digits: number[];
}

export const countryCodes: CountryCode[] = [
  { code: "+371", country: "Latvija", format: "+371 XXXXXXXX", digits: [8] },
  { code: "+370", country: "Lietuva", format: "+370 XXXXXXXX", digits: [8] },
  { code: "+372", country: "Igaunija", format: "+372 XXXXXXXX", digits: [7, 8] },
  { code: "+48", country: "Polija", format: "+48 XXXXXXXXX", digits: [9] },
  { code: "+7", country: "Krievija", format: "+7 XXX XXX XXXX", digits: [10] },
  { code: "+375", country: "Baltkrievija", format: "+375 XX XXX XXXX", digits: [9] },
  { code: "+380", country: "Ukraina", format: "+380 XX XXX XXXX", digits: [9] },
  { code: "+1", country: "ASV / Kanāda", format: "+1 XXX XXX XXXX", digits: [10] },
  { code: "+44", country: "Lielbritānija", format: "+44 XXXX XXXXXX", digits: [10] },
  { code: "+49", country: "Vācija", format: "+49 XXXX XXXXXX", digits: [10, 11] },
  { code: "+33", country: "Francija", format: "+33 X XX XX XX XX", digits: [9] },
  { code: "+46", country: "Zviedrija", format: "+46 XX XXX XXXX", digits: [9] },
  { code: "+358", country: "Somija", format: "+358 XX XXX XXXX", digits: [9] },
  { code: "+47", country: "Norvēģija", format: "+47 XXX XX XXX", digits: [8] }
];

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
    "Krievija": "🇷🇺",
    "Baltkrievija": "🇧🇾",
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
