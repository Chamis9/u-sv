
import { useEffect } from "react";
import { useSubscribers } from "@/hooks/useSubscribers";
import { useLanguage } from "@/features/language";

export function useSubscribersPage() {
  const { 
    subscribers, 
    searchTerm, 
    isLoading, 
    error, 
    isAuth,
    handleSearch, 
    handleDeleteSubscriber,
    handleUpdateSubscriber,
    handleDownloadCSV,
    refreshSubscribers,
    totalSubscribers
  } = useSubscribers();
  
  const { currentLanguage } = useLanguage();
  
  // Translation helper function
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  // Share the total subscribers count with the parent component
  useEffect(() => {
    // Using CustomEvent to pass data to parent component
    const event = new CustomEvent('subscriberCountUpdated', { 
      detail: { count: totalSubscribers } 
    });
    window.dispatchEvent(event);
  }, [totalSubscribers]);

  const handleRetry = () => {
    console.log("Manual refresh triggered");
    refreshSubscribers();
  };

  return {
    subscribers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    totalSubscribers,
    handleSearch,
    handleDeleteSubscriber,
    handleUpdateSubscriber,
    handleDownloadCSV,
    handleRetry,
    t
  };
}
