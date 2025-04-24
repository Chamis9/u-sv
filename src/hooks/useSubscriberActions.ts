
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Subscriber } from '@/types/subscribers';
import { useLanguage } from '@/features/language';
import { deleteSubscriber, updateSubscriber, createDownloadableCSV, downloadBlob } from '@/utils/subscriberManagement';

export function useSubscriberActions() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentLanguage } = useLanguage();

  const t = (lvText: string, enText: string) => {
    return currentLanguage.code === 'lv' ? lvText : enText;
  };

  const handleDeleteSubscriber = async (
    id: number,
    subscribers: Subscriber[],
    searchTerm: string,
    updateCache: (newSubscribers: Subscriber[]) => void,
    updateFilteredSubscribers: (newSubscribers: Subscriber[]) => void
  ) => {
    setIsDeleting(true);

    try {
      const subscriber = subscribers.find(sub => sub.id === id);
      if (!subscriber) throw new Error('Subscriber not found');
      
      const { success, error } = await deleteSubscriber(id, subscriber.email);
      
      if (!success) throw new Error(error || 'Unknown error');
      
      const newSubscribers = subscribers.filter(sub => sub.id !== id);
      updateCache(newSubscribers);
      updateFilteredSubscribers(newSubscribers);
      
      toast({
        description: t('Abonents veiksmīgi dzēsts', 'Subscriber deleted successfully')
      });
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      toast({
        variant: 'destructive',
        description: t('Kļūda dzēšot abonentu. Lūdzu, mēģiniet vēlreiz.', 
                      'Error deleting subscriber. Please try again.')
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleUpdateSubscriber = async (
    id: number,
    email: string,
    subscribers: Subscriber[],
    searchTerm: string,
    updateCache: (newSubscribers: Subscriber[]) => void,
    updateFilteredSubscribers: (newSubscribers: Subscriber[]) => void
  ) => {
    setIsUpdating(true);
    
    try {
      const oldSubscriber = subscribers.find(sub => sub.id === id);
      if (!oldSubscriber) throw new Error('Subscriber not found');
      
      const { success, error } = await updateSubscriber(id, email, oldSubscriber.email);
      
      if (!success) throw new Error(error || 'Unknown error');
      
      const newSubscribers = subscribers.map(sub => 
        sub.id === id ? { ...sub, email } : sub
      );
      updateCache(newSubscribers);
      updateFilteredSubscribers(newSubscribers);
      
      toast({
        description: t('Abonents veiksmīgi atjaunināts', 'Subscriber updated successfully')
      });
    } catch (err) {
      console.error('Error updating subscriber:', err);
      toast({
        variant: 'destructive',
        description: t('Kļūda atjauninot abonentu. Lūdzu, mēģiniet vēlreiz.', 
                      'Error updating subscriber. Please try again.')
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadCSV = (subscribers: Subscriber[], currentLanguage: { code: string }) => {
    if (!subscribers || subscribers.length === 0) {
      toast({
        description: t('Nav abonentu, ko lejupielādēt', 'No subscribers to download'),
      });
      return;
    }

    try {
      const { blob, filename } = createDownloadableCSV(subscribers);
      downloadBlob(blob, filename);
      
      toast({
        description: t('CSV fails veiksmīgi lejupielādēts', 'CSV file downloaded successfully'),
      });
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast({
        variant: "destructive",
        description: t('Kļūda lejupielādējot failu', 'Error downloading file'),
      });
    }
  };
  
  return { 
    handleDeleteSubscriber, 
    handleUpdateSubscriber, 
    handleDownloadCSV,
    isDeleting,
    isUpdating
  };
}
