
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Subscriber } from '@/types/subscribers';
import { useLanguage } from '@/features/language';
import { filterSubscribers, createDownloadableCSV, downloadBlob } from '@/utils/subscriberUtils';
import { logActivity } from '@/utils/activityLogger';

export function useSubscriberActions() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentLanguage, translations } = useLanguage();
  const t = translations.admin?.subscribers || {};

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
      const subscriberEmail = subscriber?.email;

      console.log(`Attempting to delete subscriber with ID: ${id}`);

      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error from Supabase deleting subscriber:', error);
        throw error;
      }
      
      const newSubscribers = subscribers.filter(sub => sub.id !== id);
      updateCache(newSubscribers);
      updateFilteredSubscribers(newSubscribers);
      
      if (subscriberEmail) {
        logActivity({
          activityType: 'subscriber',
          description: `Subscriber deleted`,
          email: subscriberEmail
        });
      }
      
      toast({
        description: t.deleteSuccess || 'Subscriber deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      toast({
        variant: 'destructive',
        description: t.deleteError || 'Error deleting subscriber. Please try again.'
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
      const oldEmail = oldSubscriber?.email;
      
      console.log(`Attempting to update subscriber with ID: ${id}, new email: ${email}`);
      
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({ email })
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error from Supabase updating subscriber:', error);
        throw error;
      }
      
      const newSubscribers = subscribers.map(sub => 
        sub.id === id ? { ...sub, email } : sub
      );
      updateCache(newSubscribers);
      updateFilteredSubscribers(newSubscribers);
      
      logActivity({
        activityType: 'subscriber',
        description: `Subscriber email updated`,
        email: email,
        metadata: { oldEmail }
      });
      
      toast({
        description: t.updateSuccess || 'Subscriber updated successfully'
      });
    } catch (err) {
      console.error('Error updating subscriber:', err);
      toast({
        variant: 'destructive',
        description: t.updateError || 'Error updating subscriber. Please try again.'
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
