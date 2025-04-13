
import React, { useState, memo, useCallback } from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { User as UserType } from "@/types/users";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserTableHeader, SortField, SortDirection } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { UserTableEmptyRow } from "./UserTableEmptyRow";

interface UserListTableProps {
  users: UserType[];
  onUserUpdated: (updatedUser: UserType) => void;
  onUserDeleted: (userId: string) => void;
  onToggleStatus: (user: UserType) => void;
}

// Memoize the entire table component
export const UserListTable = memo(function UserListTable({ 
  users, 
  onUserUpdated, 
  onUserDeleted, 
  onToggleStatus 
}: UserListTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Use useCallback to memoize the event handlers
  const handleEditClick = useCallback((user: UserType) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((user: UserType) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  }, []);

  const handleStatusToggle = useCallback((user: UserType) => {
    onToggleStatus(user);
  }, [onToggleStatus]);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setSelectedUser(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteOpen(false);
    setSelectedUser(null);
  }, []);
  
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  // Only render users if there are any
  const hasUsers = users && users.length > 0;
  
  // Sort users if sorting is applied
  const sortedUsers = React.useMemo(() => {
    if (!sortField || !sortDirection || !hasUsers) return users;
    
    return [...users].sort((a, b) => {
      const valueA = a[sortField as keyof UserType];
      const valueB = b[sortField as keyof UserType];
      
      // Handle null values
      if (valueA === null) return sortDirection === 'asc' ? -1 : 1;
      if (valueB === null) return sortDirection === 'asc' ? 1 : -1;
      
      // Special case for dates
      if (sortField === 'created_at' || sortField === 'last_sign_in_at') {
        const dateA = valueA ? new Date(valueA as string).getTime() : 0;
        const dateB = valueB ? new Date(valueB as string).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Default string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    });
  }, [users, sortField, sortDirection, hasUsers]);

  return (
    <>
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <UserTableHeader 
            onSort={handleSort} 
            sortField={sortField} 
            sortDirection={sortDirection} 
          />
          <TableBody>
            {hasUsers ? (
              sortedUsers.map(user => (
                <UserTableRow 
                  key={user.id}
                  user={user}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleStatusToggle}
                />
              ))
            ) : (
              <UserTableEmptyRow colSpan={8} />
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Only render dialogs when they're needed */}
      {isEditOpen && selectedUser && (
        <EditUserDialog 
          user={selectedUser}
          open={isEditOpen}
          onClose={handleCloseEdit}
          onUserUpdated={onUserUpdated}
        />
      )}
      
      {isDeleteOpen && selectedUser && (
        <DeleteUserDialog 
          user={selectedUser}
          open={isDeleteOpen}
          onClose={handleCloseDelete}
          onUserDeleted={onUserDeleted}
        />
      )}
    </>
  );
});
