
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Mail } from "lucide-react";
import { Activity, JsonActivity } from "@/components/admin/activity/types";
import { useAdminTranslations } from "@/hooks/useAdminTranslations";
import { supabase } from "@/integrations/supabase/client";
import { ActivityIcon } from "@/components/admin/activity/ActivityIcon";

interface RecentActivitiesCardProps {
  onShowAllActivities: () => void;
  latestSubscriber: { email: string, time: string } | null;
  isLoading: boolean;
}

export function RecentActivitiesCard({ 
  onShowAllActivities, 
  latestSubscriber, 
  isLoading 
}: RecentActivitiesCardProps) {
  const { t, formatRelativeTime } = useAdminTranslations();
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  
  useEffect(() => {
    const fetchRecentActivities = async () => {
      setActivitiesLoading(true);
      try {
        // Use RPC call to get recent activities
        const { data, error } = await supabase.rpc<JsonActivity[]>('get_recent_activities', { limit_num: 2 });
        
        if (error) {
          throw error;
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
          
          setRecentActivities(parsedActivities);
        } else {
          setRecentActivities([]);
        }
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        setRecentActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };
    
    fetchRecentActivities();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Pēdējās aktivitātes', 'Recent Activities')}</CardTitle>
        <CardDescription>{t('Pēdējās lietotāju darbības platformā', 'Recent user actions on the platform')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activitiesLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : recentActivities.length > 0 ? (
          recentActivities.map(activity => (
            <div className="flex items-center gap-4 rounded-lg border p-3" key={activity.id}>
              <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                <ActivityIcon type={activity.activity_type} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {activity.description}
                  {activity.email && (
                    <span className="text-sm font-medium text-muted-foreground ml-1">
                      {activity.email}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(activity.created_at)}
                </p>
              </div>
            </div>
          ))
        ) : latestSubscriber ? (
          <div className="flex items-center gap-4 rounded-lg border p-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {t('Jauns e-pasta abonents', 'New email subscriber')}:&nbsp;
                <span className="text-sm font-medium text-muted-foreground">{latestSubscriber.email}</span>
              </p>
              <p className="text-xs text-muted-foreground">{latestSubscriber.time}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-lg border p-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{t('Jauns e-pasta abonents', 'New email subscriber')}</p>
              <p className="text-xs text-muted-foreground">{isLoading ? t('Ielādē...', 'Loading...') : t('Nav abonentu', 'No subscribers')}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm" onClick={onShowAllActivities}>
          {t('Skatīt visas aktivitātes', 'View all activities')}
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
