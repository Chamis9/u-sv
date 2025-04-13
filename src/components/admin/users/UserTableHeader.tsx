
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/features/language";

export function UserTableHeader() {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{t('Vārds', 'Name')}</TableHead>
        <TableHead>{t('Telefons', 'Phone')}</TableHead>
        <TableHead>{t('E-pasts', 'Email')}</TableHead>
        <TableHead>{t('Loma', 'Role')}</TableHead>
        <TableHead>{t('Statuss', 'Status')}</TableHead>
        <TableHead>{t('Pievienošanās datums', 'Join Date')}</TableHead>
        <TableHead>{t('Pēdējā pieslēgšanās', 'Last Login')}</TableHead>
        <TableHead className="text-right">{t('Darbības', 'Actions')}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
