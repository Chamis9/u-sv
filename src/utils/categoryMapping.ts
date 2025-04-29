
// Utility functions for mapping between categories and table names

// Map category name to table name
export const getCategoryTableName = (category?: string): string => {
  if (!category) return 'tickets_other';
  
  // Convert to lowercase and remove non-alphanumeric characters
  const normalizedCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '');
  
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
    'teatris': 'tickets_theatre',
    'koncerti': 'tickets_concerts',
    // Note: 'sports' in Latvian is the same as in English, so not duplicating
    'festivali': 'tickets_festivals',
    'kino': 'tickets_cinema',
    'berniem': 'tickets_children',
    'celojumi': 'tickets_travel',
    'davanukartes': 'tickets_giftcards'
  };
  
  return categoryToTable[normalizedCategory] || 'tickets_other';
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
  // First normalize the path
  const normalizedPath = urlPath.toLowerCase().replace(/-/g, '');
  
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
      'davanukartes': 'Dāvanu kartes',
      'other': 'Citi'
    }
  };
  
  const langMap = displayNames[languageCode] || displayNames['en'];
  
  return langMap[normalizedPath] || (languageCode === 'lv' ? 'Citi' : 'Other');
};
