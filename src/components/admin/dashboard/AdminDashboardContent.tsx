
import React, { useState, useEffect, useCallback, useRef } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { RecentActivitiesCard } from "./RecentActivitiesCard";
import { SystemStatusCard } from "./SystemStatusCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { ActivityLogModal } from "@/components/admin/activity";
import { useSubscribers } from "@/hooks/useSubscribers";
import { useAdminTranslations } from "@/hooks/useAdminTranslations";

export function AdminDashboardContent() {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const { formatRelativeTime } = useAdminTranslations();
  
  // Use refs to prevent memory leaks
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Optimize subscriber data fetching
  const { 
    subscribers,
    refreshSubscribers, 
    isLoading, 
    totalSubscribers 
  } = useSubscribers();
  
  const [latestSubscriber, setLatestSubscriber] = useState<{ email: string, time: string } | null>(null);
  
  // Memoize subscriber processing to avoid expensive calculations on each render
  const processSubscribers = useCallback(() => {
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
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error refreshing subscribers:", error);
        }
      }
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refreshSubscribers]);
  
  // Process subscribers when they change
  useEffect(() => {
    processSubscribers();
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
}
