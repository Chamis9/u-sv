
import React, { useEffect, useState } from "react";
import { useSubscribers } from "@/hooks/useSubscribers";
import { useLanguage } from "@/features/language";
import { SubscriberListHeader } from "@/components/admin/subscribers/SubscriberListHeader";
import { SubscriberListTable } from "@/components/admin/subscribers/SubscriberListTable";
import { EmptyOrErrorState } from "@/components/admin/subscribers/EmptyOrErrorState";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function AdminSubscribers() {
  const { 
    subscribers, 
    searchTerm, 
    isLoading, 
    error, 
    handleSearch, 
    handleDeleteSubscriber, 
    handleDownloadCSV,
    refreshSubscribers
  } = useSubscribers();
  
  const { currentLanguage } = useLanguage();
  const [dbStatus, setDbStatus] = useState({ checked: false, connected: false, error: "" });
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Debug: Test Supabase connection and newsletter_subscribers table
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        console.log("Testing Supabase connection...");
        
        // First test if the table exists 
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .limit(1);
        
        console.log("Direct Supabase query result:", { data, error });
        
        if (error) {
          console.error("❌ Data fetching error:", error);
          setDbStatus({ 
            checked: true, 
            connected: false, 
            error: error.message 
          });
        } else {
          setDbStatus({ 
            checked: true, 
            connected: true, 
            error: "" 
          });
          
          // Log the count of data for debugging
          console.log(`📊 Found ${data?.length || 0} subscribers in database`);
        }
      } catch (err) {
        console.error("❌ Unexpected error in database check:", err);
        setDbStatus({ 
          checked: true, 
          connected: false, 
          error: err instanceof Error ? err.message : "Unknown error" 
        });
      }
    };
    
    checkDatabase();
  }, []);

  // Debug: Log the current subscribers data
  useEffect(() => {
    console.log("Current subscribers in component:", subscribers);
  }, [subscribers]);

  const handleRetry = () => {
    console.log("Manual refresh triggered");
    refreshSubscribers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('E-pasta abonenti', 'Email Subscribers')}</h1>
        <p className="text-muted-foreground">{t('Pārvaldiet jūsu jaunumu abonentu sarakstu', 'Manage your newsletter subscriber list')}</p>
      </div>
      
      <SubscriberListHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onDownloadCSV={handleDownloadCSV}
      />
      
      {/* Show database connection status if there's an issue */}
      {dbStatus.checked && !dbStatus.connected && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">{t('Datu bāzes savienojuma kļūda', 'Database Connection Error')}</h3>
          </div>
          <p className="mt-2 text-sm">{dbStatus.error || t('Nevarēja izveidot savienojumu ar datu bāzi', 'Could not connect to database')}</p>
          <Button className="mt-3" variant="outline" size="sm" onClick={handleRetry}>
            {t('Mēģināt vēlreiz', 'Try Again')}
          </Button>
        </div>
      )}
      
      {/* Show data access error if connected but can't get data */}
      {dbStatus.checked && dbStatus.connected && dbStatus.error && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-yellow-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">{t('Datu piekļuves kļūda', 'Data Access Error')}</h3>
          </div>
          <p className="mt-2 text-sm">{dbStatus.error}</p>
          <p className="mt-2 text-sm">{t('Iespējams jāpārbauda Row Level Security (RLS) iestatījumi Supabase.', 'You may need to check Row Level Security (RLS) settings in Supabase.')}</p>
          <Button className="mt-3" variant="outline" size="sm" onClick={handleRetry}>
            {t('Mēģināt vēlreiz', 'Try Again')}
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <EmptyOrErrorState 
          isLoading={true} 
          error=""
        />
      ) : error ? (
        <EmptyOrErrorState 
          isLoading={false} 
          error={error}
          onRetry={handleRetry}
        />
      ) : subscribers.length === 0 && searchTerm ? (
        <EmptyOrErrorState 
          isLoading={false} 
          error=""
          searchTerm={searchTerm} 
        />
      ) : subscribers.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-center">
          <div>
            <p className="text-muted-foreground">
              {t('Nav neviena abonenta. Pievienojiet pirmo abonentu, izmantojot jaunumu pietiekšanās formu vai manuāli izveidojiet ierakstu Supabase.', 
                'No subscribers yet. Add your first subscriber using the newsletter signup form or manually create a record in Supabase.')}
            </p>
            <Button className="mt-4" variant="outline" onClick={handleRetry}>
              {t('Atsvaidzināt datus', 'Refresh Data')}
            </Button>
          </div>
        </div>
      ) : (
        <SubscriberListTable 
          subscribers={subscribers} 
          onDelete={handleDeleteSubscriber} 
        />
      )}
    </div>
  );
}
