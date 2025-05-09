
import { Translations } from './types';
import { languages } from './languages';
import { lvTranslations } from './translations/lv';
import { enTranslations } from './translations/en';
import { contactTranslations } from './translations/features';

const translationsData: Record<string, Translations> = {
  lv: lvTranslations,
  en: enTranslations
};

// Export the contact translations separately since they're used directly in the Contact page
export { contactTranslations };
export { languages };
export default translationsData;
