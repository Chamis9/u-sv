
import { Category } from "@/hooks/useCategories";
import { eventsTranslations } from "@/features/language/translations/features/events";

export const getLocalizedCategoryName = (category: Category, languageCode: string): string => {
  switch (languageCode) {
    case 'lv':
      return category.name_lv || category.name;
    case 'en':
      return category.name_en || category.name;
    case 'lt':
      return category.name_lt || category.name;
    case 'et':
    case 'ee':
      return category.name_ee || category.name;
    default:
      return category.name;
  }
};

export const getLocalizedCategoryDescription = (category: Category, languageCode: string): string => {
  // Get the category description from database first
  let description = '';
  switch (languageCode) {
    case 'lv':
      description = category.description_lv || category.description || '';
      break;
    case 'en':
      description = category.description_en || category.description || '';
      break;
    case 'lt':
      description = category.description_lt || category.description || '';
      break;
    case 'et':
    case 'ee':
      description = category.description_ee || category.description || '';
      break;
    default:
      description = category.description || '';
  }

  // If description is not properly translated (contains only Latvian text in non-LV languages), 
  // use fallback from translations
  if (description === 'Ceļojumu pakalpojumi' && languageCode !== 'lv') {
    const langCode = languageCode === 'et' || languageCode === 'ee' ? 'et' : languageCode;
    const translations = eventsTranslations[langCode as keyof typeof eventsTranslations];
    
    // Map category names to translation keys
    const categoryName = category.name.toLowerCase();
    if (categoryName === 'ceļojumi' || categoryName === 'travel') {
      return translations?.travelDesc || description;
    }
  }

  return description;
};
