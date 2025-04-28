
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { Category } from '@/hooks/useCategories';
import { CategoryDialog } from './CategoryDialog';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { CategoriesTable } from './components/CategoriesTable';
import { useCategoryMutations } from './mutations/useCategoryMutations';

export function AdminCategoriesList() {
  const { currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data as Category[];
    }
  });

  const { createMutation, updateMutation, deleteMutation, toggleStatusMutation } = useCategoryMutations();

  const handleSave = async (data: Partial<Category>) => {
    try {
      setIsSubmitting(true);
      if (selectedCategory) {
        await updateMutation.mutateAsync({ ...data, id: selectedCategory.id });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setSelectedCategory(undefined);
    } catch (error) {
      console.error('Error in handleSave:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    await toggleStatusMutation.mutateAsync({ id, status: newStatus });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error as Error} />;
  }

  if (!categories || categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t('Kategoriju pārvaldība', 'Category Management')}
        </h2>
        <Button onClick={() => {
          setSelectedCategory(undefined);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          {t('Pievienot kategoriju', 'Add Category')}
        </Button>
      </div>

      <CategoriesTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCategory(undefined);
        }}
        onSave={handleSave}
        category={selectedCategory}
        mode={selectedCategory ? 'edit' : 'create'}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default AdminCategoriesList;
