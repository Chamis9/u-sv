
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Category } from '@/hooks/useCategories';
import { useLanguage } from '@/features/language';

interface AdminCategoryRowProps {
  category: Category;
  onUpdate: () => void;
}

export function AdminCategoryRow({ category, onUpdate }: AdminCategoryRowProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <TableRow>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.description || '-'}</TableCell>
      <TableCell>{category.priority || 999}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
