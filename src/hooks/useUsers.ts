
import { useState, useEffect, useCallback } from 'react';
import { useUserCache } from '@/hooks/useUserCache';
import { useUserActions } from '@/hooks/useUserActions';
import { useUserSearch } from '@/hooks/useUserSearch';
import { useUserLoading } from '@/hooks/useUserLoading';
import { useLanguage } from '@/features/language';
import type { User } from '@/types/users';
import { useToast } from '@/hooks/use-toast';

export type { User };

export function useUsers() {
  const { users, updateCache } = useUserCache();
  const { isLoading, error, isAuth, loadUsers } = useUserLoading();
  const { handleDownloadCSV } = useUserActions();
  const { searchTerm, filteredUsers, handleSearch, updateFilteredUsers } = useUserSearch(users);
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const getUsers = useCallback(async () => {
    const { data, error } = await loadUsers();
    
    if (!error && data) {
      updateCache(data);
    } else {
      updateCache([]);
    }
  }, [loadUsers, updateCache]);

  // When the users list is updated, we need to update the filtered list as well
  useEffect(() => {
    updateFilteredUsers(users);
  }, [users, updateFilteredUsers]);

  const wrappedHandleDownloadCSV = () => {
    handleDownloadCSV(users, currentLanguage);
  };
  
  // Update a user in the list
  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    updateCache(updatedUsers);
  };
  
  // Remove a user from the list
  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    updateCache(updatedUsers);
    
    toast({
      description: t('Lietotājs veiksmīgi dzēsts', 'User successfully deleted')
    });
  };

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    handleSearch,
    handleDownloadCSV: wrappedHandleDownloadCSV,
    refreshUsers: getUsers,
    totalUsers: users.length,
    updateUser,
    deleteUser
  };
}
