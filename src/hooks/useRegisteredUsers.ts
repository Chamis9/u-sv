
import { useEffect } from "react";
import { useUserFetch, useUserSearch, useUserModifications } from "@/hooks/user";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { downloadUsersCSV, downloadBlob } from "@/utils/user";

export function useRegisteredUsers() {
  const { 
    users, 
    isLoading, 
    error, 
    fetchUsers,
    setUsers,
    cachedUsersRef
  } = useUserFetch('registered_users');
  
  const {
    searchTerm,
    filteredUsers,
    handleSearch,
    setFilteredUsers
  } = useUserSearch(users);
  
  const {
    handleUserUpdated,
    handleUserDeleted,
    handleToggleStatus
  } = useUserModifications({
    users,
    filteredUsers,
    setUsers,
    setFilteredUsers,
    cachedUsersRef,
    tableName: 'registered_users'
  });
  
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Use lazy initialization for the initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 100); // Small delay to allow UI to render first
    
    return () => clearTimeout(timer);
  }, [fetchUsers]);

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

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    fetchRegisteredUsers: fetchUsers,
    handleSearch,
    handleUserUpdated,
    handleUserDeleted,
    handleToggleStatus,
    handleDownloadCSV
  };
}
