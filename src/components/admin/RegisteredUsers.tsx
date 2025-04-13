
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { EmptyOrErrorState } from "@/components/admin/users/EmptyOrErrorState";
import { UserListHeader } from "@/components/admin/users/UserListHeader";
import { UserListTable } from "@/components/admin/users/UserListTable";
import { UserDataError } from "@/components/admin/users/UserDataError";
import { UserEmptyState } from "@/components/admin/users/UserEmptyState";
import { RefreshDataButton } from "@/components/admin/users/RefreshDataButton";
import { useRegisteredUsers } from "@/hooks/useRegisteredUsers";
import { downloadUsersCSV, downloadBlob } from "@/utils/user";
import { Pagination } from "@/components/ui/pagination";

export function RegisteredUsers() {
  const { 
    users, 
    searchTerm, 
    isLoading, 
    error, 
    fetchRegisteredUsers, 
    handleSearch, 
    handleUserUpdated, 
    handleUserDeleted,
    handleToggleStatus 
  } = useRegisteredUsers();
  
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const totalPages = Math.ceil(users.length / pageSize);
  
  // Get current page of users
  const currentUsers = users.slice((page - 1) * pageSize, page * pageSize);

  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Initial load
  useEffect(() => {
    fetchRegisteredUsers();
  }, []);
  
  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // CSV export
  const handleDownloadCSV = () => {
    if (!users || users.length === 0) {
      toast({
        description: t('Nav lietotāju, ko lejupielādēt', 'No users to download'),
      });
      return;
    }

    try {
      const { blob, filename } = downloadUsersCSV(users, currentLanguage);
      downloadBlob(blob, filename);
      
      toast({
        description: t('CSV fails veiksmīgi lejupielādēts', 'CSV file downloaded successfully'),
      });
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast({
        variant: "destructive",
        description: t('Kļūda lejupielādējot failu', 'Error downloading file'),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('Lietotāju pārvaldība', 'User Management')}</h1>
        <p className="text-muted-foreground">{t('Pārvaldiet platformas lietotājus', 'Manage platform users')}</p>
      </div>
      
      <RefreshDataButton onRefresh={fetchRegisteredUsers} isLoading={isLoading} />
      
      {isLoading ? (
        <EmptyOrErrorState 
          isLoading={true} 
          error=""
        />
      ) : error ? (
        <UserDataError error={error} onRetry={fetchRegisteredUsers} />
      ) : (
        <>
          <UserListHeader 
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onDownloadCSV={handleDownloadCSV}
          />
          
          {users.length === 0 && searchTerm ? (
            <EmptyOrErrorState 
              isLoading={false} 
              error=""
              searchTerm={searchTerm} 
            />
          ) : users.length === 0 ? (
            <UserEmptyState onRefresh={fetchRegisteredUsers} />
          ) : (
            <>
              <UserListTable 
                users={currentUsers} 
                onUserUpdated={handleUserUpdated}
                onUserDeleted={handleUserDeleted}
                onToggleStatus={handleToggleStatus}
              />
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <Pagination.PrevButton
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      disabled={page === 1}
                    />
                    <div className="flex items-center mx-4">
                      {t('Lapa', 'Page')} {page} {t('no', 'of')} {totalPages}
                    </div>
                    <Pagination.NextButton
                      onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
