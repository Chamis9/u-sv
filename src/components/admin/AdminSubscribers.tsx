
import React from "react";
import { useSubscribers } from "@/hooks/useSubscribers";
import { useLanguage } from "@/features/language";
import { SubscriberListHeader } from "@/components/admin/subscribers/SubscriberListHeader";
import { SubscriberListTable } from "@/components/admin/subscribers/SubscriberListTable";
import { EmptyOrErrorState } from "@/components/admin/subscribers/EmptyOrErrorState";

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
      
      {isLoading || error || (searchTerm && subscribers.length === 0) ? (
        <EmptyOrErrorState 
          isLoading={isLoading} 
          error={error}
          searchTerm={searchTerm && subscribers.length === 0 ? searchTerm : undefined} 
        />
      ) : (
        <SubscriberListTable 
          subscribers={subscribers} 
          onDelete={handleDeleteSubscriber} 
        />
      )}
    </div>
  );
}
