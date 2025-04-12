
import { useState, useCallback } from 'react';
import { useSubscriberCache } from '@/hooks/useSubscriberCache';
import { useSubscriberAuth } from '@/hooks/useSubscriberAuth';
import { useSubscriberActions } from '@/hooks/useSubscriberActions';
import { fetchSubscribers, filterSubscribers } from '@/utils/subscriberUtils';
import { useLanguage } from '@/features/language';
import type { Subscriber } from '@/types/subscribers';

export type { Subscriber };

export function useSubscribers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { subscribers, filteredSubscribers, setFilteredSubscribers, updateCache } = useSubscriberCache();
  const { isAuth } = useSubscriberAuth();
  const { handleDeleteSubscriber, handleUpdateSubscriber, handleDownloadCSV } = useSubscriberActions();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

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
        updateCache([]);
      } else {
        console.log("Received subscriber data:", data);
        if (data) {
          updateCache(data);
        } else {
          updateCache([]);
          console.warn("No data returned from fetchSubscribers but no error thrown");
        }
      }
    } catch (err) {
      console.error("Unexpected error in getSubscribers:", err);
      setError(t('Neizdevās ielādēt abonentus. Lūdzu, mēģiniet vēlreiz.', 
                 'Failed to load subscribers. Please try again.'));
      updateCache([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage.code, t, isAuth, updateCache]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = filterSubscribers(subscribers, term);
    setFilteredSubscribers(filtered);
  };

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
    refreshSubscribers: getSubscribers,
    totalSubscribers: subscribers.length
  };
}
