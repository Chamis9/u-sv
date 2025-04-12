
import { useState, useEffect, useCallback } from 'react';
import { useUserCache } from '@/hooks/useUserCache';
import { useUserActions } from '@/hooks/useUserActions';
import { useUserSearch } from '@/hooks/useUserSearch';
import { useUserLoading } from '@/hooks/useUserLoading';
import { useLanguage } from '@/features/language';
import type { User } from '@/types/users';

export type { User };

export function useUsers() {
  const { users, updateCache } = useUserCache();
  const { isLoading, error, isAuth, loadUsers } = useUserLoading();
  const { handleDownloadCSV } = useUserActions();
  const { searchTerm, filteredUsers, handleSearch, updateFilteredUsers } = useUserSearch(users);
  const { currentLanguage } = useLanguage();

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

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    handleSearch,
    handleDownloadCSV: wrappedHandleDownloadCSV,
    refreshUsers: getUsers,
    totalUsers: users.length
  };
}
