
// Utility functions for mapping category names to display names

// Define category translations for all supported languages
const categoryTranslations = {
  'en': {
    'theatre': 'Theatre',
    'concerts': 'Concerts',
    'sports': 'Sports',
    'festivals': 'Festivals',
    'cinema': 'Cinema',
    'children': 'For Children',
    'travel': 'Travel',
    'giftcards': 'Gift Cards',
    'other': 'Other Events'
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
    'other': 'Citi pasākumi'
  },
  'lt': {
    'theatre': 'Teatras',
    'concerts': 'Koncertai',
    'sports': 'Sportas',
    'festivals': 'Festivaliai',
    'cinema': 'Kinas',
    'children': 'Vaikams',
    'travel': 'Kelionės',
    'giftcards': 'Dovanų kortelės',
    'other': 'Kiti renginiai'
  },
  'et': {
    'theatre': 'Teater',
    'concerts': 'Kontserdid',
    'sports': 'Sport',
    'festivals': 'Festivalid',
    'cinema': 'Kino',
    'children': 'Lastele',
    'travel': 'Reisimine',
    'giftcards': 'Kinkekaardid',
    'other': 'Muud üritused'
  }
};

// Convert URL path to display name
export const getCategoryDisplayName = (urlPath: string, languageCode: string): string => {
  // Normalize the path: remove dashes, spaces, and convert to lowercase
  const normalizedPath = urlPath.toLowerCase().replace(/[-\s]/g, '');
  
  // Get translations for specified language or default to English
  const langMap = categoryTranslations[languageCode as keyof typeof categoryTranslations] || categoryTranslations['en'];
  
  // Try direct match first
  if (langMap[normalizedPath as keyof typeof langMap]) {
    return langMap[normalizedPath as keyof typeof langMap];
  }
  
  // If no direct match, look for partial matches
  for (const [key, value] of Object.entries(langMap)) {
    if (normalizedPath.includes(key)) {
      return value;
    }
  }
  
  // Default fallback based on language
  if (languageCode === 'lv') return 'Citi pasākumi';
  if (languageCode === 'lt') return 'Kiti renginiai';
  if (languageCode === 'et') return 'Muud üritused';
  return 'Other Events';
};
