
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Mail } from "lucide-react";
import { useLanguage } from "@/features/language";
import type { User } from "@/types/users";
import { SendEmailDialog } from "./SendEmailDialog";

interface UserActionsMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserActionsMenu({ user, onEdit, onDelete }: UserActionsMenuProps) {
  const { currentLanguage } = useLanguage();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false);
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("Atvērt izvēlni", "Open menu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>{t("Rediģēt", "Edit")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(user)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{t("Dzēst", "Delete")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEmailDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            <span>{t("Sūtīt e-pastu", "Send Email")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SendEmailDialog
        user={user}
        open={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
      />
    </>
  );
}
