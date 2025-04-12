
import React, { useEffect, useState } from "react";
import { useSubscribers } from "@/hooks/useSubscribers";
import { useLanguage } from "@/features/language";
import { SubscriberListHeader } from "@/components/admin/subscribers/SubscriberListHeader";
import { SubscriberListTable } from "@/components/admin/subscribers/SubscriberListTable";
import { EmptyOrErrorState } from "@/components/admin/subscribers/EmptyOrErrorState";
import { supabase } from "@/integrations/supabase/client";

export function AdminSubscribers() {
  const { 
    subscribers, 
    searchTerm, 
    isLoading, 
    error, 
    handleSearch, 
    handleDeleteSubscriber, 
    handleDownloadCSV 
  } = useSubscribers();
  
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Debug: Log the current subscribers data
  useEffect(() => {
    console.log("Current subscribers in component:", subscribers);
    
    // Debug: Direct query to verify data
    const checkDatabase = async () => {
      try {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .limit(10);
        
        console.log("Direct Supabase query result:", { data, error });
      } catch (err) {
        console.error("Error in direct query:", err);
      }
    };
    
    checkDatabase();
  }, [subscribers]);

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
      
      {isLoading ? (
        <EmptyOrErrorState 
          isLoading={true} 
          error=""
        />
      ) : error ? (
        <EmptyOrErrorState 
          isLoading={false} 
          error={error}
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
              {t('Nav neviena abonenta. Pievienojiet pirmo abonentu, izmantojot jaunumu pietiekšanās formu.', 
                'No subscribers yet. Add your first subscriber using the newsletter signup form.')}
            </p>
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
