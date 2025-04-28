
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryForm } from './CategoryForm';
import { useLanguage } from '@/features/language';
import { Category } from '@/hooks/useCategories';

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => Promise<void>;
  category?: Category;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function CategoryDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  category, 
  mode,
  isSubmitting = false 
}: CategoryDialogProps) {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const title = mode === 'create' 
    ? t('Pievienot kategoriju', 'Add Category')
    : t('Rediģēt kategoriju', 'Edit Category');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <CategoryForm 
          onSubmit={onSave}
          initialData={category}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
