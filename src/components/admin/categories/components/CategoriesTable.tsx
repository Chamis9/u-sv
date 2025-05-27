
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/features/language';
import { AdminCategoryRow } from '../AdminCategoryRow';
import { Category } from '@/hooks/useCategories';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, newStatus: string) => Promise<void>;
}

export function CategoriesTable({ 
  categories,
  onEdit,
  onDelete,
  onToggleStatus
}: CategoriesTableProps) {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('Nosaukums (LV)', 'Name (LV)')}</TableHead>
            <TableHead>{t('Nosaukums (EN)', 'Name (EN)')}</TableHead>
            <TableHead>{t('Nosaukums (LT)', 'Name (LT)')}</TableHead>
            <TableHead>{t('Nosaukums (EE)', 'Name (EE)')}</TableHead>
            <TableHead>{t('Apraksts', 'Description')}</TableHead>
            <TableHead>{t('Prioritāte', 'Priority')}</TableHead>
            <TableHead>{t('Statuss', 'Status')}</TableHead>
            <TableHead>{t('Darbības', 'Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category: Category) => (
            <AdminCategoryRow 
              key={category.id} 
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
