
import React, { useEffect } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { AdminUsersHeader } from "./AdminUsersHeader";
import { AdminAuthError } from "./AdminAuthError";
import { AdminUsersList } from "./AdminUsersList";
import { updateUser, deleteUser } from "@/utils/admin/adminOperations";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";

export function AdminUsersContainer() {
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
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

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
  
  // Refresh count with parent component
  useEffect(() => {
    console.log("AdminUsersContainer: users count updated to", users.length);
    const event = new CustomEvent('adminCountUpdated', { 
      detail: { count: users.length } 
    });
    window.dispatchEvent(event);
  }, [users.length]);

  // Initial fetch when component mounts
  useEffect(() => {
    console.log("AdminUsersContainer: Initial fetch");
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  return (
    <div className="space-y-6">
      <AdminUsersHeader onRefresh={handleRetry} isLoading={isLoading} />
      
      {!isAuth && <AdminAuthError />}
      
      {isAuth && (
        <AdminUsersList
          users={users}
          searchTerm={searchTerm}
          isLoading={isLoading}
          error={error}
          handleSearch={handleSearch}
          handleUserUpdated={handleUserEditedUpdate}
          handleUserDeleted={handleUserDeletedAction}
          handleRetry={handleRetry}
        />
      )}
    </div>
  );
}
