
import { useLanguage } from "@/features/language";

export function useProfileTranslation() {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    return enText;
  };
  
  return { t };
}
