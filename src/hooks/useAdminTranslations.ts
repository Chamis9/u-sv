
import { useLanguage } from "@/features/language";
import { formatDistanceToNow } from "date-fns";
import { lv, enUS } from "date-fns/locale";

export function useAdminTranslations() {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    return enText;
  };

  const getLocale = () => {
    return currentLanguage.code === 'lv' ? lv : enUS;
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { 
        addSuffix: true,
        locale: getLocale()
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return t('Pirms brīža', 'Recently');
    }
  };
  
  return {
    t,
    formatRelativeTime,
    currentLanguage
  };
}
