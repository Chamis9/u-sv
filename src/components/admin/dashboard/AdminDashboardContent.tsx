
import React, { useState, useEffect } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { RecentActivitiesCard } from "./RecentActivitiesCard";
import { SystemStatusCard } from "./SystemStatusCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { ActivityLogModal } from "@/components/admin/activity";
import { useSubscribers } from "@/hooks/useSubscribers";
import { useAdminTranslations } from "@/hooks/useAdminTranslations";

export function AdminDashboardContent() {
  const { subscribers, refreshSubscribers, isLoading, totalSubscribers } = useSubscribers();
  const [latestSubscriber, setLatestSubscriber] = useState<{ email: string, time: string } | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const { formatRelativeTime } = useAdminTranslations();
  
  useEffect(() => {
    refreshSubscribers();
  }, [refreshSubscribers]);
  
  useEffect(() => {
    if (subscribers.length > 0) {
      const sorted = [...subscribers].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      const newest = sorted[0];
      setLatestSubscriber({
        email: newest.email || 'Unknown',
        time: formatRelativeTime(newest.created_at)
      });
    }
  }, [subscribers, formatRelativeTime]);
  
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

      <ActivityLogModal 
        open={showActivityModal} 
        onOpenChange={setShowActivityModal} 
      />
    </div>
  );
}
