
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/features/language';
import { AdminCategoryRow } from './AdminCategoryRow';
import { Category } from '@/hooks/useCategories';
import { CategoryDialog } from './CategoryDialog';
import { toast } from "sonner";

export function AdminCategoriesList() {
  const { currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newCategory: Partial<Category>) => {
      // Make sure name is provided for a new category
      if (!newCategory.name) {
        throw new Error('Category name is required');
      }
      
      // Convert to the required format for Supabase insert
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description || null,
        priority: newCategory.priority !== undefined ? newCategory.priority : 999,
        status: newCategory.status || 'active'
      };
      
      const { error } = await supabase
        .from('categories')
        .insert([categoryData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(t('Kategorija pievienota', 'Category added'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Category> & { id: string }) => {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(t('Kategorija atjaunināta', 'Category updated'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('categories')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    }
  });

  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const handleSave = async (data: Partial<Category>) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ ...data, id: selectedCategory.id });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setSelectedCategory(undefined);
    } catch (error) {
      toast.error(t('Kļūda saglabājot kategoriju', 'Error saving category'));
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Nosaukums', 'Name')}</TableHead>
              <TableHead>{t('Apraksts', 'Description')}</TableHead>
              <TableHead>{t('Prioritāte', 'Priority')}</TableHead>
              <TableHead>{t('Darbības', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category: Category) => (
              <AdminCategoryRow 
                key={category.id} 
                category={category} 
                onUpdate={refetch}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCategory(undefined);
        }}
        onSave={handleSave}
        category={selectedCategory}
        mode={selectedCategory ? 'edit' : 'create'}
      />
    </div>
  );
}

export default AdminCategoriesList;
