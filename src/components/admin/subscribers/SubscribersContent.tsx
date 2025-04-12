
import React from "react";
import { SubscriberListHeader } from "./SubscriberListHeader";
import { SubscriberListTable } from "./SubscriberListTable";
import { EmptyOrErrorState } from "./EmptyOrErrorState";
import { EmptySubscribersList } from "./EmptySubscribersList";
import { FetchErrorMessage } from "./FetchErrorMessage";

interface SubscribersContentProps {
  isLoading: boolean;
  error: string;
  searchTerm: string;
  subscribers: any[];
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadCSV: () => void;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, email: string) => Promise<void>;
  onRetry: () => void;
  t: (lvText: string, enText: string) => string;
}

export function SubscribersContent({
  isLoading,
  error,
  searchTerm,
  subscribers,
  onSearch,
  onDownloadCSV,
  onDelete,
  onUpdate,
  onRetry,
  t
}: SubscribersContentProps) {
  if (isLoading) {
    return (
      <EmptyOrErrorState 
        isLoading={true} 
        error=""
      />
    );
  }
  
  if (error) {
    return (
      <FetchErrorMessage
        error={error}
        errorTitle={t('Datu ielādes kļūda', 'Data Loading Error')}
        retryLabel={t('Mēģināt vēlreiz', 'Try Again')}
        onRetry={onRetry}
      />
    );
  }
  
  if (subscribers.length === 0 && searchTerm) {
    return (
      <EmptyOrErrorState 
        isLoading={false} 
        error=""
        searchTerm={searchTerm} 
      />
    );
  }
  
  if (subscribers.length === 0) {
    return (
      <EmptySubscribersList
        message={t('Nav neviena abonenta. Pievienojiet pirmo abonentu, izmantojot jaunumu pietiekšanās formu vai manuāli izveidojiet ierakstu Supabase.', 
                   'No subscribers yet. Add your first subscriber using the newsletter signup form or manually create a record in Supabase.')}
        buttonLabel={t('Atsvaidzināt datus', 'Refresh Data')}
        onRefresh={onRetry}
      />
    );
  }
  
  return (
    <>
      <SubscriberListHeader 
        searchTerm={searchTerm}
        onSearchChange={onSearch}
        onDownloadCSV={onDownloadCSV}
      />
      
      <SubscriberListTable 
        subscribers={subscribers} 
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </>
  );
}
