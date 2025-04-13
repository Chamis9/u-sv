
import React, { useState, memo } from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { User as UserType } from "@/types/users";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserTableHeader } from "./UserTableHeader";
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
  
  const handleEditClick = (user: UserType) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleStatusToggle = (user: UserType) => {
    onToggleStatus(user);
  };

  return (
    <>
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <UserTableHeader />
          <TableBody>
            {users.length > 0 ? (
              users.map(user => (
                <UserTableRow 
                  key={user.id}
                  user={user}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleStatusToggle}
                />
              ))
            ) : (
              <UserTableEmptyRow colSpan={7} />
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Only render dialogs when they're needed */}
      {isEditOpen && (
        <EditUserDialog 
          user={selectedUser}
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onUserUpdated={onUserUpdated}
        />
      )}
      
      {isDeleteOpen && (
        <DeleteUserDialog 
          user={selectedUser}
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onUserDeleted={onUserDeleted}
        />
      )}
    </>
  );
});
