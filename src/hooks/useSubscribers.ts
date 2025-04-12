
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/features/language';

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
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching subscribers from Supabase...");
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Subscribers data received:", data);
        setSubscribers(data || []);
        setFilteredSubscribers(data || []);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
        setError(t('Neizdevās ielādēt abonentus. Lūdzu, mēģiniet vēlreiz.', 
                   'Failed to load subscribers. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscribers();
  }, [currentLanguage.code, t]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredSubscribers(subscribers);
    } else {
      const filtered = subscribers.filter(subscriber => 
        subscriber.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    }
  };

  // Handle delete subscriber
  const handleDeleteSubscriber = async (id: number) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      setFilteredSubscribers(filteredSubscribers.filter(sub => sub.id !== id));
      
      toast({
        description: t("Abonents veiksmīgi dzēsts", "Subscriber successfully deleted"),
      });
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      toast({
        variant: "destructive",
        description: t("Neizdevās dzēst abonentu. Lūdzu, mēģiniet vēlreiz.",
                       "Failed to delete subscriber. Please try again."),
      });
    }
  };

  // Handle download CSV
  const handleDownloadCSV = () => {
    // Create CSV content
    const csvContent = [
      [
        t('ID', 'ID'), 
        t('E-pasts', 'Email'), 
        t('Pievienošanās datums', 'Join Date')
      ],
      ...subscribers.map(sub => [
        sub.id, 
        sub.email, 
        new Date(sub.created_at).toLocaleDateString(currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')
      ])
    ]
    .map(row => row.join(','))
    .join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${t('abonenti', 'subscribers')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      description: t("Abonentu saraksts lejupielādēts", "Subscribers list downloaded"),
    });
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
