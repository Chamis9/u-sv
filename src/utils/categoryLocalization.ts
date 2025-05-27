
import { Category } from "@/hooks/useCategories";

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
  switch (languageCode) {
    case 'lv':
      return category.description_lv || category.description || '';
    case 'en':
      return category.description_en || category.description || '';
    case 'lt':
      return category.description_lt || category.description || '';
    case 'et':
    case 'ee':
      return category.description_ee || category.description || '';
    default:
      return category.description || '';
  }
};
