
// Helper functions for category related operations

export const getCategoryIdFromName = (name: string): string => {
  switch(name.toLowerCase()) {
    case 'teatris':
    case 'theatre':
      return 'theatre';
    case 'koncerti':
    case 'concerts':
      return 'concerts';
    case 'sports':
      return 'sports';
    default:
      return name;
  }
};

export const getCategoryDisplayName = (categoryId: string, languageCode: string): string => {
  if (languageCode === 'lv') {
    switch(categoryId.toLowerCase()) {
      case 'theatre': return 'Teātris';
      case 'concerts': return 'Koncerti';
      case 'sports': return 'Sports';
      default: return categoryId;
    }
  } else {
    switch(categoryId.toLowerCase()) {
      case 'theatre': return 'Theatre';
      case 'concerts': return 'Concerts';
      case 'sports': return 'Sports';
      default: return categoryId;
    }
  }
};
