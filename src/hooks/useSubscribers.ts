
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/features/language';
import { 
  fetchSubscribers, 
  deleteSubscriber, 
  filterSubscribers, 
  generateSubscribersCSV, 
  downloadCSV 
} from '@/utils/subscriberUtils';

export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export function useSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  // Helper function for translation
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Fetch subscribers
  useEffect(() => {
    const getSubscribers = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        console.log("Fetching subscribers...");
        const { data, error } = await fetchSubscribers();
        
        if (error) {
          console.error("Error fetching subscribers:", error);
          setError(t('Neizdevās ielādēt abonentus. Lūdzu, mēģiniet vēlreiz.', 
                     'Failed to load subscribers. Please try again.'));
        } else {
          console.log("Received subscriber data:", data);
          if (data) {
            setSubscribers(data);
            setFilteredSubscribers(data);
          } else {
            // Handle the case where data is null but no error
            setSubscribers([]);
            setFilteredSubscribers([]);
            console.warn("No data returned from fetchSubscribers but no error thrown");
          }
        }
      } catch (err) {
        console.error("Unexpected error in getSubscribers:", err);
        setError(t('Neizdevās ielādēt abonentus. Lūdzu, mēģiniet vēlreiz.', 
                   'Failed to load subscribers. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    };
    
    getSubscribers();
  }, [currentLanguage.code, t]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = filterSubscribers(subscribers, term);
    setFilteredSubscribers(filtered);
  };

  // Handle delete subscriber
  const handleDeleteSubscriber = async (id: number) => {
    try {
      const { success, error } = await deleteSubscriber(id);
      
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

  // Handle download CSV
  const handleDownloadCSV = () => {
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
    subscribers: filteredSubscribers,
    searchTerm,
    isLoading,
    error,
    handleSearch,
    handleDeleteSubscriber,
    handleDownloadCSV
  };
}
