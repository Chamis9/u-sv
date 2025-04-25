
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/features/language';
import { AdminCategoryRow } from './AdminCategoryRow';
import { Category } from '@/hooks/useCategories';

export function AdminCategoriesList() {
  const { currentLanguage } = useLanguage();

  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t('Kategoriju pārvaldība', 'Category Management')}
        </h2>
        <Button>
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
              <AdminCategoryRow key={category.id} category={category} onUpdate={refetch} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdminCategoriesList;
