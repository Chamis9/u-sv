
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

  const { data: categories, isLoading } = useQuery({
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
        priority: newCategory.priority !== undefined ? parseInt(newCategory.priority.toString()) : 999,
        status: newCategory.status || 'active'
      };
      
      console.log('Creating category with data:', categoryData);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select();
        
      if (error) {
        console.error('Error creating category:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(t('Kategorija pievienota', 'Category added'));
    },
    onError: (error) => {
      console.error('Create mutation error:', error);
      toast.error(t('Kļūda pievienojot kategoriju', 'Error adding category'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Category> & { id: string }) => {
      if (!id) {
        throw new Error('Category ID is required for update');
      }
      
      const updateData = {
        ...(updates.name && { name: updates.name }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.priority !== undefined && { priority: parseInt(updates.priority.toString()) }),
        ...(updates.status && { status: updates.status }),
      };
      
      console.log('Updating category with ID:', id, 'Data:', updateData);
      
      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select();
        
      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(t('Kategorija atjaunināta', 'Category updated'));
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
      toast.error(t('Kļūda atjaunojot kategoriju', 'Error updating category'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to delete category with ID:', id);
      
      const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .select();
        
      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(t('Kategorija izdzēsta', 'Category deleted'));
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast.error(t('Kļūda dzēšot kategoriju', 'Error deleting category'));
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Toggling status for category ID:', id, 'New status:', status);
      
      const { data, error } = await supabase
        .from('categories')
        .update({ status })
        .eq('id', id)
        .select();
        
      if (error) {
        console.error('Error toggling category status:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(t('Kategorijas statuss mainīts', 'Category status changed'));
    },
    onError: (error) => {
      console.error('Toggle status mutation error:', error);
      toast.error(t('Kļūda mainot statusu', 'Error changing status'));
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
      console.error('Error in handleSave:', error);
      toast.error(t('Kļūda saglabājot kategoriju', 'Error saving category'));
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, status: newStatus });
    } catch (error) {
      console.error('Error in handleToggleStatus:', error);
    }
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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Nosaukums', 'Name')}</TableHead>
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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">{t('Nav nevienas kategorijas', 'No categories found')}</p>
        </div>
      )}

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
