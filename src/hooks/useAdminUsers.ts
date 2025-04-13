
import { useEffect, useRef } from "react";
import { useUserFetch, useUserSearch, useUserModifications } from "@/hooks/user";

export function useAdminUsers() {
  const initialized = useRef(false);
  
  const { 
    users, 
    isLoading, 
    error,
    isAuth,
    fetchUsers,
    setUsers,
    cachedUsersRef
  } = useUserFetch('admin_user');
  
  const {
    searchTerm,
    filteredUsers,
    handleSearch,
    setFilteredUsers
  } = useUserSearch(users);
  
  const {
    handleUserUpdated,
    handleUserDeleted
  } = useUserModifications({
    users,
    filteredUsers,
    setUsers,
    setFilteredUsers,
    cachedUsersRef,
    tableName: 'admin_user'
  });
  
  // Use lazy initialization for the initial data fetch, but only once
  useEffect(() => {
    if (!initialized.current) {
      const timer = setTimeout(() => {
        fetchUsers();
        initialized.current = true;
      }, 100); // Small delay to allow UI to render first
      
      return () => clearTimeout(timer);
    }
  }, [fetchUsers]);

  const refreshData = () => {
    fetchUsers(true); // Force a refresh
  };

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    fetchAdminUsers: refreshData,
    handleSearch,
    handleUserUpdated,
    handleUserDeleted
  };
}
