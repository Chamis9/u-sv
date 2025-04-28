
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
import { Badge } from "@/components/ui/badge";

interface AdminCategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, newStatus: string) => Promise<void>;
}

export function AdminCategoryRow({ 
  category, 
  onEdit,
  onDelete,
  onToggleStatus 
}: AdminCategoryRowProps) {
  const { currentLanguage } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(category.id);
      toast.success(t('Kategorija izdzēsta', 'Category deleted'));
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error(t('Kļūda dzēšot kategoriju', 'Error deleting category'));
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = category.status === 'active' ? 'hidden' : 'active';
      await onToggleStatus(category.id, newStatus);
      toast.success(
        category.status === 'active' 
          ? t('Kategorija paslēpta', 'Category hidden') 
          : t('Kategorija aktivizēta', 'Category activated')
      );
    } catch (error) {
      console.error('Error in handleToggleStatus:', error);
      toast.error(t('Kļūda mainot statusu', 'Error changing status'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <TableRow className={category.status === 'hidden' ? 'opacity-60' : ''}>
        <TableCell>{category.name}</TableCell>
        <TableCell>{category.description || '-'}</TableCell>
        <TableCell>{category.priority || 999}</TableCell>
        <TableCell>
          <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
            {category.status === 'active' 
              ? t('Aktīvs', 'Active') 
              : t('Paslēpts', 'Hidden')}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">{t('Rediģēt', 'Edit')}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleStatus} 
              disabled={isUpdatingStatus}
            >
              {category.status === 'active' ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {category.status === 'active' 
                  ? t('Paslēpt', 'Hide') 
                  : t('Parādīt', 'Show')}
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">{t('Dzēst', 'Delete')}</span>
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
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? t('Dzēš...', 'Deleting...') : t('Dzēst', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
