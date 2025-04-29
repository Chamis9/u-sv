
// Utility functions for mapping category names to display names

// Convert URL path to display name
export const getCategoryDisplayName = (urlPath: string, languageCode: string): string => {
  // Normalize the path: remove dashes, spaces, and convert to lowercase
  const normalizedPath = urlPath.toLowerCase().replace(/[-\s]/g, '');
  
  const displayNames: Record<string, Record<string, string>> = {
    'en': {
      'theatre': 'Theatre',
      'concerts': 'Concerts',
      'sports': 'Sports',
      'festivals': 'Festivals',
      'cinema': 'Cinema',
      'children': 'Children',
      'travel': 'Travel',
      'giftcards': 'Gift Cards',
      'other': 'Other'
    },
    'lv': {
      'theatre': 'Teātris',
      'concerts': 'Koncerti',
      'sports': 'Sports',
      'festivals': 'Festivāli',
      'cinema': 'Kino',
      'children': 'Bērniem',
      'travel': 'Ceļojumi',
      'giftcards': 'Dāvanu kartes',
      'other': 'Citi'
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
