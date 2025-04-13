
import React, { memo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/features/language";
import type { User } from "@/types/users";
import { UserContactInfo } from "./UserContactInfo";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserActionsMenu } from "./UserActionsMenu";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

// Memoize the row component to prevent unnecessary re-renders
export const UserTableRow = memo(function UserTableRow({ 
  user, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: UserTableRowProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        currentLanguage.code === 'lv' ? "lv-LV" : "en-US"
      );
    } catch (e) {
      return t('Nezināms datums', 'Unknown date');
    }
  };
  
  return (
    <TableRow>
      <TableCell>
        <UserContactInfo name={user.name} phone={user.phone} />
      </TableCell>
      <TableCell className="font-medium">{user.email || t('Nav e-pasta', 'No email')}</TableCell>
      <TableCell>
        {user.role === "admin" ? (
          <Badge variant="default">{t('Administrators', 'Administrator')}</Badge>
        ) : (
          <Badge variant="outline">{t('Lietotājs', 'User')}</Badge>
        )}
      </TableCell>
      <TableCell>
        <UserStatusBadge status={user.status || 'active'} />
      </TableCell>
      <TableCell>{user.created_at ? formatDate(user.created_at) : t('Nav datuma', 'No date')}</TableCell>
      <TableCell>
        {user.last_sign_in_at 
          ? formatDate(user.last_sign_in_at) 
          : t('Nav pieslēdzies', 'Never logged in')}
      </TableCell>
      <TableCell className="text-right">
        <UserActionsMenu
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      </TableCell>
    </TableRow>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.status === nextProps.user.status &&
    prevProps.user.updated_at === nextProps.user.updated_at
  );
});
