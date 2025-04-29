
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "@/components/admin/activity/types";
import { useLanguage } from "@/features/language";

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
      // Use RPC call for count to avoid type errors
      const { data: count, error: countError } = await supabase.rpc('get_activity_count');
      
      if (countError) {
        throw countError;
      }
      
      if (count !== null) {
        setTotalCount(count);
      }
      
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Use RPC call to get activities instead of direct table access
      const { data, error: activitiesError } = await supabase.rpc('get_activities', {
        page_size: pageSize,
        page_number: currentPage
      });
      
      if (activitiesError) {
        throw activitiesError;
      }
      
      // Make sure to cast data to Activity[] to avoid type errors
      setActivities(data as Activity[] || []);
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
