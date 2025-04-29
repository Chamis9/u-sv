
// Helper functions for category related operations

export const getCategoryIdFromName = (name: string): string => {
  switch(name.toLowerCase()) {
    case 'teatris':
    case 'theatre':
      return 'Teātris';
    case 'koncerti':
    case 'concerts':
      return 'Koncerti';
    case 'sports':
      return 'Sports';
    case 'festivali':
    case 'festivāli':
    case 'festivals':
      return 'Festivāli';
    case 'kino':
    case 'cinema':
      return 'Kino';
    case 'berniem':
    case 'bērniem':
    case 'children':
      return 'Bērniem';
    case 'celojumi':
    case 'ceļojumi':
    case 'travel':
      return 'Ceļojumi';
    case 'davanu-kartes':
    case 'dāvanu-kartes':
    case 'dāvanu kartes':
    case 'davanu kartes':
    case 'gift-cards':
    case 'gift cards':
      return 'Dāvanu kartes';
    case 'citi':
    case 'citi-pasakumi':
    case 'citi pasākumi':
    case 'other':
    case 'other-events':
      return 'Citi pasākumi';
    default:
      return name;
  }
};

export const getCategoryDisplayName = (categoryId: string, languageCode: string): string => {
  if (languageCode === 'lv') {
    switch(categoryId.toLowerCase()) {
      case 'theatre': 
      case 'teatris': return 'Teātris';
      case 'concerts': 
      case 'koncerti': return 'Koncerti';
      case 'sports': return 'Sports';
      case 'festivals': 
      case 'festivali': 
      case 'festivāli': return 'Festivāli';
      case 'cinema': 
      case 'kino': return 'Kino';
      case 'children': 
      case 'berniem': 
      case 'bērniem': return 'Bērniem';
      case 'travel': 
      case 'celojumi': 
      case 'ceļojumi': return 'Ceļojumi';
      case 'giftcards': 
      case 'davanu-kartes': 
      case 'dāvanu-kartes': 
      case 'davanu kartes': 
      case 'dāvanu kartes': return 'Dāvanu kartes';
      case 'other': 
      case 'citi': 
      case 'citi-pasakumi': 
      case 'citi pasākumi': return 'Citi pasākumi';
      default: return categoryId;
    }
  } else {
    switch(categoryId.toLowerCase()) {
      case 'theatre': 
      case 'teatris': return 'Theatre';
      case 'concerts': 
      case 'koncerti': return 'Concerts';
      case 'sports': return 'Sports';
      case 'festivals': 
      case 'festivali': 
      case 'festivāli': return 'Festivals';
      case 'cinema': 
      case 'kino': return 'Cinema';
      case 'children': 
      case 'berniem': 
      case 'bērniem': return 'For Children';
      case 'travel': 
      case 'celojumi': 
      case 'ceļojumi': return 'Travel';
      case 'giftcards': 
      case 'davanu-kartes': 
      case 'dāvanu-kartes': 
      case 'davanu kartes': 
      case 'dāvanu kartes': return 'Gift Cards';
      case 'other': 
      case 'citi': 
      case 'citi-pasakumi': 
      case 'citi pasākumi': return 'Other Events';
      default: return categoryId;
    }
  }
};
