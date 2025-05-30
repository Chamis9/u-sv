
import { Translations } from './types';
import { languages } from './languages';
import { lvTranslations } from './translations/lv';
import { enTranslations } from './translations/en';
import { eeTranslations } from './translations/ee';
import { ltTranslations } from './translations/lt';
import { contactTranslations } from './translations/features';

const translationsData: Record<string, Translations> = {
  lv: lvTranslations,
  en: enTranslations,
  ee: eeTranslations,
  lt: ltTranslations
};

// Export the contact translations separately since they're used directly in the Contact page
export { contactTranslations };
export { languages };
export default translationsData;
