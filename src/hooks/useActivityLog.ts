
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Activity, JsonActivity } from "@/components/admin/activity/types";
import { useLanguage } from "@/features/language";
import { PostgrestError } from '@supabase/supabase-js';

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
      // Use RPC call for count
      const { data: count, error: countError } = await supabase.rpc<number>('get_activity_count');
      
      if (countError) {
        throw countError;
      }
      
      if (count !== null) {
        setTotalCount(count);
      }
      
      // Use RPC call to get activities
      const { data, error: activitiesError } = await supabase.rpc<JsonActivity[]>('get_activities', {
        page_size: pageSize,
        page_number: currentPage
      });
      
      if (activitiesError) {
        throw activitiesError;
      }
      
      // Parse the JSON data to Activity objects
      if (data && Array.isArray(data)) {
        const parsedActivities: Activity[] = data.map((item: any) => ({
          id: item.id,
          activity_type: item.activity_type,
          description: item.description,
          email: item.email,
          user_id: item.user_id,
          metadata: item.metadata,
          created_at: item.created_at
        }));
        
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
