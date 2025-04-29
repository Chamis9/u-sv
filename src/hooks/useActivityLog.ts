
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Activity, safeConvertJsonArrayToActivities } from "@/components/admin/activity/types";
import { useLanguage } from "@/features/language";
import { Json } from "@/integrations/supabase/types";

export function useActivityLog(pageSize = 10, enabled = true) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    return enText;
  };
  
  const fetchActivities = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use RPC call for count with proper parameters
      const { data: countData, error: countError } = await supabase.rpc('get_activity_count');
      
      if (countError) {
        throw countError;
      }
      
      // Ensure countData is a number before setting state
      if (typeof countData === 'number') {
        setTotalCount(countData);
      }
      
      // Use RPC call to get activities with proper parameters
      const { data, error: activitiesError } = await supabase.rpc('get_activities', {
        page_size: pageSize,
        page_number: currentPage
      });
      
      if (activitiesError) {
        throw activitiesError;
      }
      
      // Parse the JSON data to Activity objects using our safe converter
      if (data && Array.isArray(data)) {
        const parsedActivities = safeConvertJsonArrayToActivities(data as Json[]);
        setActivities(parsedActivities);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(t(
        'Neizdevās ielādēt aktivitātes. Lūdzu, mēģiniet vēlreiz.', 
        'Failed to load activities. Please try again.'
      ));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch activities when enabled, currentPage changes
  useEffect(() => {
    if (enabled) {
      fetchActivities();
    }
  }, [enabled, currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    activities,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    handlePageChange,
    refresh: fetchActivities
  };
}
