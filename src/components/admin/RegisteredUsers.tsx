
import React, { useState, useCallback } from "react";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { EmptyOrErrorState } from "@/components/admin/users/EmptyOrErrorState";
import { UserListHeader } from "@/components/admin/users/UserListHeader";
import { UserListTable } from "@/components/admin/users/UserListTable";
import { UserDataError } from "@/components/admin/users/UserDataError";
import { UserEmptyState } from "@/components/admin/users/UserEmptyState";
import { RefreshDataButton } from "@/components/admin/users/RefreshDataButton";
import { useRegisteredUsers } from "@/hooks/useRegisteredUsers";
import { AddUserDialog } from "@/components/admin/users/AddUserDialog";
import { FilterDialog } from "@/components/admin/users/FilterDialog";
import { Pagination } from "@/components/ui/pagination";
import { User } from "@/types/users";

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
    handleToggleStatus,
    handleDownloadCSV 
  } = useRegisteredUsers();
  
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
  
  // Filter users based on active filters
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      // Check each filter criteria
      if (activeFilters.name && !user.name?.toLowerCase().includes(activeFilters.name.toLowerCase())) {
        return false;
      }
      if (activeFilters.email && !user.email?.toLowerCase().includes(activeFilters.email.toLowerCase())) {
        return false;
      }
      if (activeFilters.phone && !user.phone?.toLowerCase().includes(activeFilters.phone.toLowerCase())) {
        return false;
      }
      if (activeFilters.role && user.role !== activeFilters.role) {
        return false;
      }
      if (activeFilters.status && user.status !== activeFilters.status) {
        return false;
      }
      // More complex date filters could be added here if needed
      
      return true;
    });
  }, [users, activeFilters]);
  
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  
  // Apply pagination
  const currentUsers = React.useMemo(() => {
    return filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredUsers, page, pageSize]);

  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  // Reset to first page when search or filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, activeFilters]);

  const handleAddUser = () => {
    setIsAddDialogOpen(true);
  };

  const handleApplyFilter = (filters: any) => {
    setActiveFilters(filters);
    setPage(1);
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
            onAddUser={handleAddUser}
          />
          
          {filteredUsers.length === 0 && searchTerm ? (
            <EmptyOrErrorState 
              isLoading={false} 
              error=""
              searchTerm={searchTerm} 
            />
          ) : filteredUsers.length === 0 ? (
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
          
          {isAddDialogOpen && (
            <AddUserDialog 
              open={isAddDialogOpen}
              onClose={() => setIsAddDialogOpen(false)}
              onUserAdded={handleUserUpdated}
            />
          )}
          
          {isFilterDialogOpen && (
            <FilterDialog 
              open={isFilterDialogOpen}
              onClose={() => setIsFilterDialogOpen(false)}
              onApplyFilter={handleApplyFilter}
              isAdmin={false}
            />
          )}
        </>
      )}
    </div>
  );
}
