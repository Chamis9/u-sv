
import { useEffect } from "react";
import { useUserFetch, useUserSearch, useUserModifications } from "@/hooks/user";

export function useAdminUsers() {
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
  
  // Use lazy initialization for the initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 100); // Small delay to allow UI to render first
    
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    fetchAdminUsers: fetchUsers,
    handleSearch,
    handleUserUpdated,
    handleUserDeleted
  };
}
