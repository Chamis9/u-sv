
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/hooks/useCategories";
import { toast } from "sonner";
import { useLanguage } from "@/features/language";

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const createMutation = useMutation({
    mutationFn: async (newCategory: Partial<Category>) => {
      if (!newCategory.name) {
        throw new Error('Category name is required');
      }
      
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description || null,
        priority: newCategory.priority !== undefined ? newCategory.priority : 999,
        status: newCategory.status || 'active'
      };
      
      // This should now work with our RLS policies for authenticated users
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
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
        ...(updates.priority !== undefined && { priority: updates.priority }),
        ...(updates.status && { status: updates.status }),
      };
      
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('Kategorija atjaunināta', 'Category updated'));
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
      toast.error(t('Kļūda atjaunojot kategoriju', 'Error updating category'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast.error(t('Kļūda dzēšot kategoriju', 'Error deleting category'));
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('categories')
        .update({ status })
        .eq('id', id);
        
      if (error) {
        console.error('Error toggling category status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Toggle status mutation error:', error);
      toast.error(t('Kļūda mainot statusu', 'Error changing status'));
    }
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleStatusMutation
  };
};
