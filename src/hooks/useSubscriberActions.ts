
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/features/language';
import { 
  deleteSubscriber as apiDeleteSubscriber, 
  updateSubscriber as apiUpdateSubscriber,
  generateSubscribersCSV,
  downloadCSV,
  filterSubscribers
} from '@/utils/subscriberUtils';
import { Subscriber } from '@/types/subscribers';

export function useSubscriberActions() {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  // Helper function for translation
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Handle search
  const handleSearch = (
    term: string, 
    subscribers: Subscriber[], 
    setFilteredSubscribers: (filtered: Subscriber[]) => void
  ) => {
    const filtered = filterSubscribers(subscribers, term);
    setFilteredSubscribers(filtered);
  };

  // Handle delete subscriber
  const handleDeleteSubscriber = async (
    id: number,
    subscribers: Subscriber[],
    searchTerm: string,
    setSubscribers: (subs: Subscriber[]) => void,
    setFilteredSubscribers: (filtered: Subscriber[]) => void
  ) => {
    try {
      const { success, error } = await apiDeleteSubscriber(id);
      
      if (success) {
        const updatedSubscribers = subscribers.filter(sub => sub.id !== id);
        setSubscribers(updatedSubscribers);
        setFilteredSubscribers(filterSubscribers(updatedSubscribers, searchTerm));
        
        toast({
          description: t("Abonents veiksmīgi dzēsts", "Subscriber successfully deleted"),
        });
      } else {
        console.error("Error deleting subscriber:", error);
        toast({
          variant: "destructive",
          description: t("Neizdevās dzēst abonentu. Lūdzu, mēģiniet vēlreiz.",
                         "Failed to delete subscriber. Please try again."),
        });
      }
    } catch (err) {
      console.error("Unexpected error in handleDeleteSubscriber:", err);
      toast({
        variant: "destructive",
        description: t("Neizdevās dzēst abonentu. Lūdzu, mēģiniet vēlreiz.",
                       "Failed to delete subscriber. Please try again."),
      });
    }
  };

  // Handle update subscriber
  const handleUpdateSubscriber = async (
    id: number, 
    email: string,
    subscribers: Subscriber[],
    searchTerm: string,
    setSubscribers: (subs: Subscriber[]) => void,
    setFilteredSubscribers: (filtered: Subscriber[]) => void
  ) => {
    try {
      const { success, error } = await apiUpdateSubscriber(id, email);
      
      if (success) {
        // Update the local state
        const updatedSubscribers = subscribers.map(sub => 
          sub.id === id ? { ...sub, email } : sub
        );
        setSubscribers(updatedSubscribers);
        setFilteredSubscribers(filterSubscribers(updatedSubscribers, searchTerm));
        
        toast({
          description: t("Abonents veiksmīgi atjaunināts", "Subscriber successfully updated"),
        });
      } else {
        console.error("Error updating subscriber:", error);
        toast({
          variant: "destructive",
          description: t("Neizdevās atjaunināt abonentu. Lūdzu, mēģiniet vēlreiz.",
                         "Failed to update subscriber. Please try again."),
        });
      }
    } catch (err) {
      console.error("Unexpected error in handleUpdateSubscriber:", err);
      toast({
        variant: "destructive",
        description: t("Neizdevās atjaunināt abonentu. Lūdzu, mēģiniet vēlreiz.",
                       "Failed to update subscriber. Please try again."),
      });
    }
  };

  // Handle download CSV
  const handleDownloadCSV = (subscribers: Subscriber[], currentLanguage: { code: string }) => {
    try {
      // Headers for CSV
      const headers = [
        t('ID', 'ID'), 
        t('E-pasts', 'Email'), 
        t('Pievienošanās datums', 'Join Date')
      ];
      
      // Generate CSV content
      const csvContent = generateSubscribersCSV(
        subscribers, 
        headers, 
        currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US'
      );
      
      // Download the CSV file
      const filename = `${t('abonenti', 'subscribers')}_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      
      toast({
        description: t("Abonentu saraksts lejupielādēts", "Subscribers list downloaded"),
      });
    } catch (err) {
      console.error("Error generating/downloading CSV:", err);
      toast({
        variant: "destructive",
        description: t("Neizdevās lejupielādēt abonentu sarakstu", "Failed to download subscribers list"),
      });
    }
  };

  return {
    handleSearch,
    handleDeleteSubscriber,
    handleUpdateSubscriber,
    handleDownloadCSV
  };
}
