
import React, { useState } from "react";
import { useLanguage } from "@/features/language";
import { UserListHeader } from "@/components/admin/users/UserListHeader";
import { UserListTable } from "@/components/admin/users/UserListTable";
import { EmptyOrErrorState } from "@/components/admin/users/EmptyOrErrorState";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react"; // Added AlertCircle import
import { User } from "@/types/users";
import { Pagination } from "@/components/ui/pagination";
import { FilterDialog } from "@/components/admin/users/FilterDialog";
import { downloadUsersCSV, downloadBlob } from "@/utils/user";
import { useToast } from "@/hooks/use-toast";

interface AdminUsersListProps {
  users: User[];
  searchTerm: string;
  isLoading: boolean;
  error: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserUpdated: (updatedUser: User) => void;
  handleUserDeleted: (userId: string) => void;
  handleRetry: () => void;
}

export function AdminUsersList({
  users,
  searchTerm,
  isLoading,
  error,
  handleSearch,
  handleUserUpdated,
  handleUserDeleted,
  handleRetry
}: AdminUsersListProps) {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Filter state
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    joinDate: "",
    lastLogin: ""
  });
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  // Filter users based on active filters
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      // Check each filter criteria
      if (activeFilters.email && !user.email?.toLowerCase().includes(activeFilters.email.toLowerCase())) {
        return false;
      }
      // More filters can be added as needed
      
      return true;
    });
  }, [users, activeFilters]);
  
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  
  // Get current page of users
  const currentUsers = React.useMemo(() => {
    return filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredUsers, page, pageSize]);
  
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
  
  const handleOpenFilter = () => {
    setIsFilterDialogOpen(true);
  };

  const handleApplyFilter = (filters: any) => {
    setActiveFilters(filters);
    setPage(1);
  };
  
  // Reset to first page when search or filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, activeFilters]);

  if (isLoading) {
    return <EmptyOrErrorState isLoading={true} error="" />;
  }
  
  if (error) {
    return (
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
    );
  }
  
  if (filteredUsers.length === 0 && searchTerm) {
    return <EmptyOrErrorState isLoading={false} error="" searchTerm={searchTerm} />;
  }
  
  if (filteredUsers.length === 0) {
    return (
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
    );
  }
  
  return (
    <>
      <UserListHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onDownloadCSV={handleDownloadCSV}
        onFilter={handleOpenFilter}
        isAdmin={true}
      />
      
      <UserListTable 
        users={currentUsers} 
        onUserUpdated={handleUserUpdated}
        onUserDeleted={handleUserDeleted}
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
      
      {isFilterDialogOpen && (
        <FilterDialog 
          open={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          onApplyFilter={handleApplyFilter}
          isAdmin={true}
        />
      )}
    </>
  );
}
