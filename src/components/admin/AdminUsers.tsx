
import React, { useEffect, useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useLanguage } from "@/features/language";
import { UserListHeader } from "@/components/admin/users/UserListHeader";
import { UserListTable } from "@/components/admin/users/UserListTable";
import { EmptyOrErrorState } from "@/components/admin/users/EmptyOrErrorState";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { User } from "@/types/users";
import { Pagination } from "@/components/ui/pagination";
import { updateUser, deleteUser } from "@/utils/admin/adminOperations";
import { useToast } from "@/hooks/use-toast";
import { downloadUsersCSV, downloadBlob } from "@/utils/user";

export function AdminUsers() {
  const { 
    users, 
    searchTerm, 
    isLoading, 
    error, 
    isAuth,
    fetchAdminUsers,
    handleSearch, 
    handleUserUpdated,
    handleUserDeleted
  } = useAdminUsers();
  
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const totalPages = Math.ceil(users.length / pageSize);
  
  // Get current page of users
  const currentUsers = users.slice((page - 1) * pageSize, page * pageSize);
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const handleDownloadCSV = () => {
    if (!users || users.length === 0) {
      toast({
        description: t('Nav administratoru, ko lejupielādēt', 'No administrators to download'),
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

  // Refresh count with parent component
  useEffect(() => {
    const event = new CustomEvent('adminCountUpdated', { 
      detail: { count: users.length } 
    });
    window.dispatchEvent(event);
  }, [users.length]);
  
  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdminUsers();
    }, 100); // Small delay to allow UI to render first
    
    return () => clearTimeout(timer);
  }, [fetchAdminUsers]);

  const handleUserEditedUpdate = async (updatedUser: User) => {
    try {
      const { success, error } = await updateUser(updatedUser);
      
      if (success) {
        handleUserUpdated(updatedUser);
        toast({
          description: t('Administrators veiksmīgi atjaunināts', 'Administrator successfully updated')
        });
      } else {
        console.error("Error updating user:", error);
        toast({
          variant: "destructive",
          title: t('Kļūda', 'Error'),
          description: error || t('Neizdevās atjaunināt administratoru', 'Failed to update administrator')
        });
      }
    } catch (err) {
      console.error("Unexpected error updating user:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās atjaunināt administratoru', 'Failed to update administrator')
      });
    }
  };

  const handleUserDeletedAction = async (userId: string) => {
    try {
      const { success, error } = await deleteUser(userId);
      
      if (success) {
        handleUserDeleted(userId);
        toast({
          description: t('Administrators veiksmīgi dzēsts', 'Administrator successfully deleted')
        });
      } else {
        console.error("Error deleting user:", error);
        toast({
          variant: "destructive",
          title: t('Kļūda', 'Error'),
          description: error || t('Neizdevās dzēst administratoru', 'Failed to delete administrator')
        });
      }
    } catch (err) {
      console.error("Unexpected error deleting user:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās dzēst administratoru', 'Failed to delete administrator')
      });
    }
  };

  const handleRetry = () => {
    console.log("Manual refresh triggered");
    fetchAdminUsers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('Administratoru pārvaldība', 'Administrator Management')}</h1>
        <p className="text-muted-foreground">{t('Pārvaldiet platformas administratorus un to lomas', 'Manage platform administrators and their roles')}</p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleRetry}
          variant="outline"
          disabled={isLoading}
          className="flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {t('Atjaunot datus no datubāzes', 'Refresh Data from Database')}
        </Button>
      </div>
      
      {!isAuth && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">{t('Autentifikācijas kļūda', 'Authentication Error')}</h3>
          </div>
          <p className="mt-2 text-sm">
            {t('Jums jāpieslēdzas ar administratora kontu, lai piekļūtu administratoriem.', 
              'You need to sign in with an administrator account to access administrators.')}
          </p>
        </div>
      )}
      
      {isAuth && (
        <>
          <UserListHeader 
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
            <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 dark:bg-red-900/20 dark:text-red-200">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <h3 className="font-medium">{t('Datu ielādes kļūda', 'Data Loading Error')}</h3>
              </div>
              <p className="mt-2 text-sm">{error}</p>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('Mēģināt vēlreiz', 'Try Again')}
                </Button>
              </div>
            </div>
          ) : users.length === 0 && searchTerm ? (
            <EmptyOrErrorState 
              isLoading={false} 
              error=""
              searchTerm={searchTerm} 
            />
          ) : users.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-center">
              <div>
                <p className="text-muted-foreground">
                  {t('Nav neviena administratora. Pievienojiet pirmo administratoru, izmantojot reģistrācijas formu vai manuāli izveidojiet ierakstu Supabase.', 
                    'No administrators yet. Add your first administrator using the registration form or manually create a record in Supabase.')}
                </p>
                <Button className="mt-4" variant="outline" onClick={handleRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('Atsvaidzināt datus', 'Refresh Data')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <UserListTable 
                users={currentUsers} 
                onUserUpdated={handleUserEditedUpdate}
                onUserDeleted={handleUserDeletedAction}
                onToggleStatus={() => {}} // Not applicable for admins
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
