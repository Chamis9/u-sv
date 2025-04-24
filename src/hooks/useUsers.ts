
import { useState, useCallback, useEffect } from 'react';
import { useUserCache } from '@/hooks/useUserCache';
import { useUserSearch } from '@/hooks/useUserSearch';
import { useUserLoading } from '@/hooks/useUserLoading';
import { useLanguage } from '@/features/language';
import { useToast } from '@/hooks/use-toast';
import { updateUser, deleteUser, toggleUserStatus, downloadUsersCSV, downloadBlob } from '@/utils/userManagement';
import type { User } from '@/types/users';

export type { User };

export function useUsers() {
  const { users, updateCache } = useUserCache();
  const { isLoading, error, isAuth, loadUsers } = useUserLoading();
  const { searchTerm, filteredUsers, handleSearch, updateFilteredUsers } = useUserSearch(users);
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Load users data
  const getUsers = useCallback(async () => {
    const { data, error } = await loadUsers();
    
    if (!error && data) {
      updateCache(data);
    } else {
      updateCache([]);
    }
  }, [loadUsers, updateCache]);

  // When the users list is updated, update the filtered list as well
  useEffect(() => {
    updateFilteredUsers(users);
  }, [users, updateFilteredUsers]);

  // Handle downloading CSV
  const handleDownloadCSV = () => {
    try {
      const { blob, filename } = downloadUsersCSV(users, currentLanguage);
      downloadBlob(blob, filename);
      
      toast({
        description: t('CSV fails veiksmīgi lejupielādēts', 'CSV file downloaded successfully'),
      });
    } catch (err) {
      console.error("Error downloading CSV:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās lejupielādēt failu', 'Failed to download file')
      });
    }
  };
  
  // Update a user in the database
  const updateUserData = async (updatedUser: User) => {
    try {
      const { success, error } = await updateUser(updatedUser);
      
      if (success) {
        const updatedUsers = users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
        updateCache(updatedUsers);
        
        toast({
          description: t('Lietotājs veiksmīgi atjaunināts', 'User successfully updated')
        });
        return true;
      } else {
        console.error("Error updating user:", error);
        toast({
          variant: "destructive",
          title: t('Kļūda', 'Error'),
          description: error || t('Neizdevās atjaunināt lietotāju', 'Failed to update user')
        });
        return false;
      }
    } catch (err) {
      console.error("Unexpected error updating user:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās atjaunināt lietotāju', 'Failed to update user')
      });
      return false;
    }
  };
  
  // Delete a user from the database
  const deleteUserData = async (userId: string) => {
    try {
      const { success, error } = await deleteUser(userId);
      
      if (success) {
        const updatedUsers = users.filter(user => user.id !== userId);
        updateCache(updatedUsers);
        
        toast({
          description: t('Lietotājs veiksmīgi dzēsts', 'User successfully deleted')
        });
        return true;
      } else {
        console.error("Error deleting user:", error);
        toast({
          variant: "destructive",
          title: t('Kļūda', 'Error'),
          description: error || t('Neizdevās dzēst lietotāju', 'Failed to delete user')
        });
        return false;
      }
    } catch (err) {
      console.error("Unexpected error deleting user:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās dzēst lietotāju', 'Failed to delete user')
      });
      return false;
    }
  };
  
  // Toggle user status (active/inactive)
  const toggleStatus = async (user: User) => {
    try {
      const { success, error } = await toggleUserStatus(user);
      
      if (success) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const updatedUser = {
          ...user,
          status: newStatus as 'active' | 'inactive'
        };
        
        const updatedUsers = users.map(u => 
          u.id === user.id ? updatedUser : u
        );
        updateCache(updatedUsers);
        
        toast({
          description: user.status === 'active' 
            ? t('Lietotājs deaktivizēts', 'User deactivated') 
            : t('Lietotājs aktivizēts', 'User activated')
        });
        return true;
      } else {
        console.error("Error toggling user status:", error);
        toast({
          variant: "destructive",
          title: t('Kļūda', 'Error'),
          description: error || t('Neizdevās mainīt lietotāja statusu', 'Failed to change user status')
        });
        return false;
      }
    } catch (err) {
      console.error("Unexpected error toggling user status:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās mainīt lietotāja statusu', 'Failed to change user status')
      });
      return false;
    }
  };

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    handleSearch,
    handleDownloadCSV,
    refreshUsers: getUsers,
    totalUsers: users.length,
    updateUser: updateUserData,
    deleteUser: deleteUserData,
    toggleUserStatus: toggleStatus
  };
}
