
import React from "react";
import { useSubscribersPage } from "@/hooks/useSubscribersPage";
import { SubscribersHeader } from "@/components/admin/subscribers/SubscribersHeader";
import { SubscribersContent } from "@/components/admin/subscribers/SubscribersContent";
import { AuthErrorMessage } from "@/components/admin/subscribers/AuthErrorMessage";

export function AdminSubscribers() {
  const {
    subscribers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    handleSearch,
    handleDeleteSubscriber,
    handleUpdateSubscriber,
    handleDownloadCSV,
    handleRetry,
    t
  } = useSubscribersPage();

  return (
    <div className="space-y-6">
      <SubscribersHeader
        title={t('E-pasta abonenti', 'Email Subscribers')}
        subtitle={t('Pārvaldiet jūsu jaunumu abonentu sarakstu', 'Manage your newsletter subscriber list')}
        onRefresh={handleRetry}
        isLoading={isLoading}
      />
      
      {!isAuth ? (
        <AuthErrorMessage
          message={t('Jums jāpieslēdzas ar administratora kontu, lai piekļūtu abonentiem.', 
                     'You need to sign in with an administrator account to access subscribers.')}
        />
      ) : (
        <SubscribersContent
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          subscribers={subscribers}
          onSearch={handleSearch}
          onDownloadCSV={handleDownloadCSV}
          onDelete={handleDeleteSubscriber}
          onUpdate={handleUpdateSubscriber}
          onRetry={handleRetry}
          t={t}
        />
      )}
    </div>
  );
}
