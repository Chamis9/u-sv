
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  User,
  Phone
} from "lucide-react";
import { useLanguage } from "@/features/language";
import { User as UserType } from "@/types/users";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useToast } from "@/hooks/use-toast";
import { toggleUserStatus } from "@/utils/userUtils";

interface UserListTableProps {
  users: UserType[];
  onUserUpdated: (updatedUser: UserType) => void;
  onUserDeleted: (userId: string) => void;
}

export function UserListTable({ users, onUserUpdated, onUserDeleted }: UserListTableProps) {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

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
      const updatedUser = {
        ...user,
        status: user.status === 'active' ? 'inactive' : 'active'
      };
      onUserUpdated(updatedUser);
      
      toast({
        description: user.status === 'active' 
          ? t('Lietotājs deaktivizēts', 'User deactivated') 
          : t('Lietotājs aktivizēts', 'User activated')
      });
    } else {
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: error || t('Neizdevās mainīt lietotāja statusu', 'Failed to change user status')
      });
    }
  };

  return (
    <>
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Vārds', 'Name')}</TableHead>
              <TableHead>{t('E-pasts', 'Email')}</TableHead>
              <TableHead>{t('Tālrunis', 'Phone')}</TableHead>
              <TableHead>{t('Loma', 'Role')}</TableHead>
              <TableHead>{t('Statuss', 'Status')}</TableHead>
              <TableHead>{t('Pievienošanās datums', 'Join Date')}</TableHead>
              <TableHead>{t('Pēdējā pieslēgšanās', 'Last Login')}</TableHead>
              <TableHead className="text-right">{t('Darbības', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {user.name || t('Nav norādīts', 'Not specified')}
                  </TableCell>
                  <TableCell className="font-medium">{user.email || t('Nav e-pasta', 'No email')}</TableCell>
                  <TableCell className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {user.phone || t('Nav tālruņa', 'No phone')}
                  </TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Badge variant="default">{t('Administrators', 'Administrator')}</Badge>
                    ) : (
                      <Badge variant="outline">{t('Lietotājs', 'User')}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{t('Aktīvs', 'Active')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-400">{t('Neaktīvs', 'Inactive')}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString(currentLanguage.code === 'lv' ? "lv-LV" : "en-US")}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString(currentLanguage.code === 'lv' ? "lv-LV" : "en-US") 
                      : t('Nav pieslēdzies', 'Never logged in')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t('Izvēlne', 'Menu')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t('Rediģēt', 'Edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusToggle(user)}>
                          {user.status === "active" ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              {t('Deaktivizēt', 'Deactivate')}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t('Aktivizēt', 'Activate')}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('Dzēst', 'Delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  {t('Nav atrasts neviens lietotājs, kas atbilst meklēšanas kritērijiem.', 
                    'No users found matching search criteria.')}
                </TableCell>
              </TableRow>
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
