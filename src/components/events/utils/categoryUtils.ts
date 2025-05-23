// Helper functions for category related operations

export const getCategoryIdFromName = (name: string): string => {
  switch(name.toLowerCase()) {
    case 'teatris':
    case 'theatre':
    case 'teatras':
    case 'teater':
      return 'Teātris';
      
    case 'koncerti':
    case 'concerts':
    case 'koncertai': 
    case 'kontserdid':
      return 'Koncerti';
      
    case 'sports':
    case 'sportas':
    case 'sport':
      return 'Sports';
      
    case 'festivali':
    case 'festivāli':
    case 'festivals':
    case 'festivaliai':
    case 'festivalid':
      return 'Festivāli';
      
    case 'kino':
    case 'cinema':
    case 'kinas':
      return 'Kino';
      
    case 'berniem':
    case 'bērniem':
    case 'children':
    case 'vaikams':
    case 'lastele':
      return 'Bērniem';
      
    case 'celojumi':
    case 'ceļojumi':
    case 'travel':
    case 'kelionės':
    case 'reisimine':
      return 'Ceļojumi';
      
    case 'davanu-kartes':
    case 'dāvanu-kartes':
    case 'dāvanu kartes':
    case 'davanu kartes':
    case 'gift-cards':
    case 'gift cards':
    case 'dovanų kortelės':
    case 'kinkekaardid':
      return 'Dāvanu kartes';
      
    case 'citi':
    case 'citi-pasakumi':
    case 'citi-pasākumi':
    case 'citi pasākumi':
    case 'other':
    case 'other-events':
    case 'kiti renginiai':
    case 'muud üritused':
      return 'Citi pasākumi';
      
    default:
      return name;
  }
};

// We're now using the more comprehensive translation system from categoryMapping.ts
export { getCategoryDisplayName } from "@/utils/categoryMapping";
