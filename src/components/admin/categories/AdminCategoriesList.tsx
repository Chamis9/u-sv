
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/hooks/useCategories';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { CategoriesTable } from './components/CategoriesTable';
import { CategoriesHeader } from './components/CategoriesHeader';
import { CategoryDialogManager } from './components/CategoryDialogManager';
import { useCategoryMutations } from './mutations/useCategoryMutations';
import { toast } from 'sonner';
import { useLanguage } from '@/features/language';

export function AdminCategoriesList() {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  // Use enabled option to prevent automatic refetching when not needed
  const { data: categories, isLoading, error, refetch } = useQuery({
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
    },
    staleTime: 0, // Consider data stale immediately
    refetchOnWindowFocus: true, // Refetch when window regains focus
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
      // Explicitly refetch after mutation completes
      await refetch();
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
    try {
      await deleteMutation.mutateAsync(id);
      // Explicitly refetch after deletion
      await refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(t('Kļūda dzēšot kategoriju', 'Error deleting category'));
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, status: newStatus });
      // Explicitly refetch after status change
      await refetch();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(t('Kļūda mainot statusu', 'Error changing status'));
    }
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
      <CategoriesHeader 
        onAddClick={() => {
          setSelectedCategory(undefined);
          setIsDialogOpen(true);
        }}
      />

      <CategoriesTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <CategoryDialogManager
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCategory(undefined);
        }}
        onSave={handleSave}
        selectedCategory={selectedCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default AdminCategoriesList;
