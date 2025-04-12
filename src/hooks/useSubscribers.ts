
import { useState, useCallback } from 'react';
import { useSubscriberCache } from '@/hooks/useSubscriberCache';
import { useSubscriberAuth } from '@/hooks/useSubscriberAuth';
import { useSubscriberActions } from '@/hooks/useSubscriberActions';
import { fetchSubscribers, filterSubscribers } from '@/utils/subscriberUtils';
import { useLanguage } from '@/features/language';
import { Subscriber } from '@/types/subscribers';

export { Subscriber } from '@/types/subscribers';

export function useSubscribers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { subscribers, filteredSubscribers, setFilteredSubscribers, updateCache } = useSubscriberCache();
  const { isAuth } = useSubscriberAuth();
  const { handleDeleteSubscriber, handleUpdateSubscriber, handleDownloadCSV } = useSubscriberActions();
  const { currentLanguage } = useLanguage();
  
  // Helper function for translation
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Fetch subscribers (as a callback so we can call it from outside)
  const getSubscribers = useCallback(async () => {
    console.log("Starting to fetch subscribers...");
    if (!isAuth) {
      console.log("Not authenticated, skipping fetch");
      setError(t('Nepieciešama autorizācija, lai piekļūtu abonentiem.', 
                 'Authentication required to access subscribers.'));
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const { data, error } = await fetchSubscribers();
      
      if (error) {
        console.error("Error fetching subscribers:", error);
        setError(t('Neizdevās ielādēt abonentus. Lūdzu, mēģiniet vēlreiz.', 
                   'Failed to load subscribers. Please try again.'));
        // Clear subscriber lists on error
        updateCache([]);
      } else {
        console.log("Received subscriber data:", data);
        if (data) {
          updateCache(data);
        } else {
          // Handle the case where data is null but no error
          updateCache([]);
          console.warn("No data returned from fetchSubscribers but no error thrown");
        }
      }
    } catch (err) {
      console.error("Unexpected error in getSubscribers:", err);
      setError(t('Neizdevās ielādēt abonentus. Lūdzu, mēģiniet vēlreiz.', 
                 'Failed to load subscribers. Please try again.'));
      // Clear subscriber lists on error
      updateCache([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage.code, t, isAuth, updateCache]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = filterSubscribers(subscribers, term);
    setFilteredSubscribers(filtered);
  };

  // Wrap action handlers to provide the needed state
  const wrappedHandleDeleteSubscriber = async (id: number) => {
    await handleDeleteSubscriber(
      id, 
      subscribers, 
      searchTerm, 
      updateCache, 
      setFilteredSubscribers
    );
  };

  const wrappedHandleUpdateSubscriber = async (id: number, email: string) => {
    await handleUpdateSubscriber(
      id, 
      email, 
      subscribers, 
      searchTerm, 
      updateCache, 
      setFilteredSubscribers
    );
  };

  const wrappedHandleDownloadCSV = () => {
    handleDownloadCSV(subscribers, currentLanguage);
  };

  return {
    subscribers: filteredSubscribers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    handleSearch,
    handleDeleteSubscriber: wrappedHandleDeleteSubscriber,
    handleUpdateSubscriber: wrappedHandleUpdateSubscriber,
    handleDownloadCSV: wrappedHandleDownloadCSV,
    refreshSubscribers: getSubscribers, // Expose refresh function
    totalSubscribers: subscribers.length // Add total count for the sidebar
  };
}
