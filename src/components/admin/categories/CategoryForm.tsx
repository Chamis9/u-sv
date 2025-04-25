
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/features/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Category } from '@/hooks/useCategories';

interface CategoryFormProps {
  onSubmit: (data: Partial<Category>) => Promise<void>;
  onCancel: () => void;
  initialData?: Category;
}

export function CategoryForm({ onSubmit, onCancel, initialData }: CategoryFormProps) {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      priority: initialData?.priority?.toString() || '999'
    }
  });

  const handleSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      priority: parseInt(data.priority)
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Nosaukums', 'Name')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Apraksts', 'Description')}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Prioritāte', 'Priority')}</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('Atcelt', 'Cancel')}
          </Button>
          <Button type="submit">
            {initialData ? t('Saglabāt', 'Save') : t('Pievienot', 'Add')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
