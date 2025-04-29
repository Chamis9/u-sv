
// Utility functions for mapping category names to display names and vice versa

// Map from URL slug to internal category ID
export const urlToCategoryId: Record<string, string> = {
  'teatris': 'theatre',
  'koncerti': 'concerts',
  'sports': 'sports',
  'festivali': 'festivals',
  'kino': 'cinema',
  'berniem': 'children',
  'celojumi': 'travel',
  'davanu-kartes': 'gift-cards',
  'citi': 'other'
};

// Convert URL path to display name
export const getCategoryDisplayName = (urlPath: string, languageCode: string): string => {
  // Normalize the path: remove dashes, spaces, and convert to lowercase
  const normalizedPath = urlPath.toLowerCase().replace(/[-\s]/g, '');
  
  const displayNames: Record<string, Record<string, string>> = {
    'en': {
      'theatre': 'Theatre',
      'teatris': 'Theatre',
      'concerts': 'Concerts',
      'koncerti': 'Concerts',
      'sports': 'Sports',
      'festivals': 'Festivals',
      'festivali': 'Festivals',
      'cinema': 'Cinema',
      'kino': 'Cinema',
      'children': 'Children',
      'berniem': 'Children',
      'travel': 'Travel',
      'celojumi': 'Travel',
      'giftcards': 'Gift Cards',
      'davankartes': 'Gift Cards',
      'davanukartes': 'Gift Cards',
      'other': 'Other',
      'citi': 'Other'
    },
    'lv': {
      'theatre': 'Teātris',
      'teatris': 'Teātris',
      'concerts': 'Koncerti',
      'koncerti': 'Koncerti',
      'sports': 'Sports',
      'festivals': 'Festivāli',
      'festivali': 'Festivāli',
      'cinema': 'Kino',
      'kino': 'Kino',
      'children': 'Bērniem',
      'berniem': 'Bērniem',
      'travel': 'Ceļojumi',
      'celojumi': 'Ceļojumi',
      'giftcards': 'Dāvanu kartes',
      'davankartes': 'Dāvanu kartes',
      'davanukartes': 'Dāvanu kartes',
      'other': 'Citi',
      'citi': 'Citi'
    }
  };
  
  const langMap = displayNames[languageCode] || displayNames['en'];
  
  // Try direct match first
  if (langMap[normalizedPath]) {
    return langMap[normalizedPath];
  }
  
  // If no direct match, look for partial matches
  for (const [key, value] of Object.entries(langMap)) {
    if (normalizedPath.includes(key)) {
      return value;
    }
  }
  
  // Default fallback
  return languageCode === 'lv' ? 'Citi' : 'Other';
};

// Get internal category ID from URL slug
export const getCategoryIdFromUrl = (urlSlug: string): string => {
  return urlToCategoryId[urlSlug] || urlSlug;
};
