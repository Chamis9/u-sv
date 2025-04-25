
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, EyeOff, Eye } from 'lucide-react';
import { Category } from '@/hooks/useCategories';
import { useLanguage } from '@/features/language';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface AdminCategoryRowProps {
  category: Category;
  onUpdate: () => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, newStatus: 'active' | 'hidden') => Promise<void>;
}

export function AdminCategoryRow({ 
  category, 
  onUpdate, 
  onEdit,
  onDelete,
  onToggleStatus 
}: AdminCategoryRowProps) {
  const { currentLanguage } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const handleDelete = async () => {
    try {
      await onDelete(category.id);
      toast.success(t('Kategorija izdzēsta', 'Category deleted'));
      onUpdate();
    } catch (error) {
      toast.error(t('Kļūda dzēšot kategoriju', 'Error deleting category'));
    }
    setShowDeleteDialog(false);
  };

  const handleToggleStatus = async () => {
    try {
      await onToggleStatus(category.id, category.status === 'active' ? 'hidden' : 'active');
      toast.success(
        category.status === 'active' 
          ? t('Kategorija paslēpta', 'Category hidden')
          : t('Kategorija aktivizēta', 'Category activated')
      );
      onUpdate();
    } catch (error) {
      toast.error(t('Kļūda mainot statusu', 'Error changing status'));
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{category.name}</TableCell>
        <TableCell>{category.description || '-'}</TableCell>
        <TableCell>{category.priority || 999}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleToggleStatus}>
              {category.status === 'active' ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Dzēst kategoriju?', 'Delete category?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'Vai tiešām vēlaties dzēst šo kategoriju? Šo darbību nevar atsaukt.',
                'Are you sure you want to delete this category? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Atcelt', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t('Dzēst', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
