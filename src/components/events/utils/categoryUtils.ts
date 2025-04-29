
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
    case 'festivali':
    case 'festivāli':
    case 'festivals':
      return 'festivals';
    case 'kino':
    case 'cinema':
      return 'cinema';
    case 'berniem':
    case 'bērniem':
    case 'children':
      return 'children';
    case 'celojumi':
    case 'ceļojumi':
    case 'travel':
      return 'travel';
    case 'davanu kartes':
    case 'dāvanu kartes':
    case 'gift cards':
      return 'giftcards';
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
      case 'festivals': return 'Festivāli';
      case 'cinema': return 'Kino';
      case 'children': return 'Bērniem';
      case 'travel': return 'Ceļojumi';
      case 'giftcards': return 'Dāvanu kartes';
      default: return categoryId;
    }
  } else {
    switch(categoryId.toLowerCase()) {
      case 'theatre': return 'Theatre';
      case 'concerts': return 'Concerts';
      case 'sports': return 'Sports';
      case 'festivals': return 'Festivals';
      case 'cinema': return 'Cinema';
      case 'children': return 'For Children';
      case 'travel': return 'Travel';
      case 'giftcards': return 'Gift Cards';
      default: return categoryId;
    }
  }
};
