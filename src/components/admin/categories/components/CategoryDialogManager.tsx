
import React from 'react';
import { CategoryDialog } from '../CategoryDialog';
import { Category } from '@/hooks/useCategories';

interface CategoryDialogManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => Promise<void>;
  selectedCategory?: Category;
  isSubmitting: boolean;
}

export function CategoryDialogManager({
  isOpen,
  onClose,
  onSave,
  selectedCategory,
  isSubmitting
}: CategoryDialogManagerProps) {
  return (
    <CategoryDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      category={selectedCategory}
      mode={selectedCategory ? 'edit' : 'create'}
      isSubmitting={isSubmitting}
    />
  );
}
