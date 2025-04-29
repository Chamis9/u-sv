
// Utility functions for mapping between categories and table names

// Map category name to table name
export const getCategoryTableName = (category?: string): string => {
  if (!category) return 'tickets_other';
  
  // Convert to lowercase and normalize
  const normalizedCategory = category.toLowerCase().trim();
  
  const categoryToTable: Record<string, string> = {
    // English
    'theatre': 'tickets_theatre',
    'concerts': 'tickets_concerts',
    'sports': 'tickets_sports',
    'festivals': 'tickets_festivals',
    'cinema': 'tickets_cinema',
    'children': 'tickets_children',
    'travel': 'tickets_travel',
    'giftcards': 'tickets_giftcards',
    // Latvian
    'teātris': 'tickets_theatre',
    // Remove the duplicate 'teatris' entry that caused the error
    'koncerti': 'tickets_concerts',
    'festivāli': 'tickets_festivals',
    'festivali': 'tickets_festivals',
    'kino': 'tickets_cinema',
    'bērniem': 'tickets_children',
    'berniem': 'tickets_children',
    'ceļojumi': 'tickets_travel',
    'celojumi': 'tickets_travel',
    'dāvanu kartes': 'tickets_giftcards',
    'davanu kartes': 'tickets_giftcards',
    'citi': 'tickets_other',
    'other': 'tickets_other'
  };
  
  // Try direct match first
  if (categoryToTable[normalizedCategory]) {
    return categoryToTable[normalizedCategory];
  }
  
  // If no direct match, look for partial matches
  for (const [key, value] of Object.entries(categoryToTable)) {
    if (normalizedCategory.includes(key)) {
      return value;
    }
  }
  
  // Default fallback
  return 'tickets_other';
};

// Map table name to category name
export const getCategoryNameFromTableName = (tableName: string): string => {
  const categoryMapping: Record<string, string> = {
    'tickets_theatre': 'Theatre',
    'tickets_concerts': 'Concerts',
    'tickets_sports': 'Sports',
    'tickets_festivals': 'Festivals',
    'tickets_cinema': 'Cinema',
    'tickets_children': 'Children',
    'tickets_travel': 'Travel',
    'tickets_giftcards': 'Gift Cards',
    'tickets_other': 'Other'
  };
  
  return categoryMapping[tableName] || 'Other';
};

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
