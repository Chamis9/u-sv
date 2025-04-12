import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Subscriber } from '@/types/subscribers';
import { useLanguage } from '@/features/language';
import { filterSubscribers } from '@/utils/subscriberUtils';
import { logActivity } from '@/utils/activityLogger';

export function useSubscriberActions() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentLanguage } = useLanguage();

  // Translation helper
  const t = (lvText: string, enText: string) => {
    return currentLanguage.code === 'lv' ? lvText : enText;
  };

  const handleDeleteSubscriber = async (
    id: number,
    subscribers: Subscriber[],
    searchTerm: string,
    updateCache: (newSubscribers: Subscriber[]) => void,
    setFilteredSubscribers: (newFilteredSubscribers: Subscriber[]) => void
  ) => {
    setIsDeleting(true);

    try {
      // Find the subscriber email before deletion
      const subscriber = subscribers.find(sub => sub.id === id);
      const subscriberEmail = subscriber?.email;

      // Delete subscriber from Supabase
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      
      // Success - update client-side data
      const newSubscribers = subscribers.filter(sub => sub.id !== id);
      updateCache(newSubscribers);
      
      // Update filtered list if search term exists
      if (searchTerm) {
        const newFilteredSubscribers = filterSubscribers(newSubscribers, searchTerm);
        setFilteredSubscribers(newFilteredSubscribers);
      } else {
        setFilteredSubscribers(newSubscribers);
      }
      
      // Log the activity
      if (subscriberEmail) {
        logActivity({
          activityType: 'subscriber',
          description: `Subscriber deleted`,
          email: subscriberEmail
        });
      }
      
      // Show success notification
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
    setFilteredSubscribers: (newFilteredSubscribers: Subscriber[]) => void
  ) => {
    setIsUpdating(true);
    
    try {
      // Find the old email before update
      const oldSubscriber = subscribers.find(sub => sub.id === id);
      const oldEmail = oldSubscriber?.email;
      
      // Update subscriber in Supabase
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({ email })
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Success - update client-side data
      const newSubscribers = subscribers.map(sub => 
        sub.id === id ? { ...sub, email } : sub
      );
      updateCache(newSubscribers);
      
      // Update filtered list if search term exists
      if (searchTerm) {
        const newFilteredSubscribers = filterSubscribers(newSubscribers, searchTerm);
        setFilteredSubscribers(newFilteredSubscribers);
      } else {
        setFilteredSubscribers(newSubscribers);
      }
      
      // Log the activity
      logActivity({
        activityType: 'subscriber',
        description: `Subscriber email updated`,
        email: email,
        metadata: { oldEmail }
      });
      
      // Show success notification
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

    const filename = 'newsletter_subscribers.csv';
    const csvHeader = 'ID,Email,Created At\n';
    let csvContent = csvHeader;

    subscribers.forEach((subscriber) => {
      const row = `${subscriber.id},${subscriber.email},${subscriber.created_at}\n`;
      csvContent += row;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) { // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    toast({
      description: t('CSV fails veiksmīgi lejupielādēts', 'CSV file downloaded successfully'),
    });
  };
  
  return { 
    handleDeleteSubscriber, 
    handleUpdateSubscriber, 
    handleDownloadCSV,
    isDeleting,
    isUpdating
  };
}
