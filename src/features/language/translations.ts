
import { Translations } from './types';
import { languages } from './languages';
import { lvTranslations } from './translations/lv';
import { enTranslations } from './translations/en';
import { ruTranslations } from './translations/ru';

const translationsData: Record<string, Translations> = {
  lv: lvTranslations,
  en: enTranslations,
  ru: ruTranslations
};

export { languages };
export default translationsData;
