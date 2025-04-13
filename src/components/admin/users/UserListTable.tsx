
import React, { useState } from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { User as UserType } from "@/types/users";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useToast } from "@/hooks/use-toast";
import { toggleUserStatus } from "@/utils/user";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { UserTableEmptyRow } from "./UserTableEmptyRow";

interface UserListTableProps {
  users: UserType[];
  onUserUpdated: (updatedUser: UserType) => void;
  onUserDeleted: (userId: string) => void;
}

export function UserListTable({ users, onUserUpdated, onUserDeleted }: UserListTableProps) {
  const { toast } = useToast();
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

  const handleStatusToggle = async (user: UserType) => {
    const { success, error } = await toggleUserStatus(user);
    
    if (success) {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const updatedUser = {
        ...user,
        status: newStatus as 'active' | 'inactive'
      };
      onUserUpdated(updatedUser);
      
      toast({
        description: user.status === 'active' 
          ? 'Lietotājs deaktivizēts' 
          : 'Lietotājs aktivizēts'
      });
    } else {
      toast({
        variant: "destructive",
        title: 'Kļūda',
        description: error || 'Neizdevās mainīt lietotāja statusu'
      });
    }
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
      
      <EditUserDialog 
        user={selectedUser}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUserUpdated={onUserUpdated}
      />
      
      <DeleteUserDialog 
        user={selectedUser}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onUserDeleted={onUserDeleted}
      />
    </>
  );
}
