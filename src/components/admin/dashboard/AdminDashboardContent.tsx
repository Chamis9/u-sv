
import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { RecentActivitiesCard } from "./RecentActivitiesCard";
import { SystemStatusCard } from "./SystemStatusCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { ActivityLogModal } from "@/components/admin/activity";
import { useSubscribers } from "@/hooks/useSubscribers";
import { useAdminTranslations } from "@/hooks/useAdminTranslations";

// Memoize entire component to prevent unnecessary rerenders
export const AdminDashboardContent = memo(function AdminDashboardContent() {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const { formatRelativeTime } = useAdminTranslations();
  
  // Use refs to prevent memory leaks
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  
  // Prevent refreshing subscribers on every render with useCallback
  const { 
    subscribers,
    refreshSubscribers, 
    isLoading, 
    totalSubscribers 
  } = useSubscribers();
  
  const [latestSubscriber, setLatestSubscriber] = useState<{ email: string, time: string } | null>(null);
  
  // Memoize subscriber processing to avoid expensive calculations on each render
  const processSubscribers = useCallback(() => {
    if (!mountedRef.current) return;
    
    if (subscribers.length > 0) {
      try {
        const sorted = [...subscribers].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        if (sorted.length > 0) {
          const newest = sorted[0];
          setLatestSubscriber({
            email: newest.email || 'Unknown',
            time: formatRelativeTime(newest.created_at)
          });
        }
      } catch (error) {
        console.error("Error processing subscribers:", error);
        setLatestSubscriber(null);
      }
    }
  }, [subscribers, formatRelativeTime]);
  
  // Use an effect to fetch data when the component mounts
  useEffect(() => {
    mountedRef.current = true;
    
    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    // Load data with the abort signal
    const loadData = async () => {
      try {
        await refreshSubscribers();
      } catch (error: any) {
        if (error.name !== 'AbortError' && mountedRef.current) {
          console.error("Error refreshing subscribers:", error);
        }
      }
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refreshSubscribers]);
  
  // Process subscribers when they change
  useEffect(() => {
    if (mountedRef.current) {
      processSubscribers();
    }
  }, [subscribers, processSubscribers]);
  
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <DashboardStatsGrid 
        totalSubscribers={totalSubscribers}
        isLoading={isLoading}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentActivitiesCard
          onShowAllActivities={() => setShowActivityModal(true)}
          latestSubscriber={latestSubscriber}
          isLoading={isLoading}
        />
        <SystemStatusCard />
        <QuickActionsCard />
      </div>

      {showActivityModal && (
        <ActivityLogModal 
          open={showActivityModal} 
          onOpenChange={setShowActivityModal} 
        />
      )}
    </div>
  );
});

