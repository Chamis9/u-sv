
import React from "react";
import { useLanguage } from "@/features/language";
import { AdminUsersList } from "@/components/admin/users/AdminUsersList";
import { useRegisteredUsers } from "@/hooks/useRegisteredUsers";

function AdminUsers() {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Users</h2>
        <p className="text-muted-foreground">
          Manage administrator accounts for your platform
        </p>
      </div>

      <AdminUsersList
        users={users}
        searchTerm={searchTerm}
        isLoading={isLoading}
        error={error}
        handleSearch={handleSearch}
        handleUserUpdated={handleUserUpdated}
        handleUserDeleted={handleUserDeleted}
        handleRetry={fetchRegisteredUsers}
      />
    </div>
  );
}

export { AdminUsers };
export default AdminUsers;
