
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/features/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Category } from '@/hooks/useCategories';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface CategoryFormProps {
  onSubmit: (data: Partial<Category>) => Promise<void>;
  onCancel: () => void;
  initialData?: Category;
  isSubmitting?: boolean;
}

export function CategoryForm({ onSubmit, onCancel, initialData, isSubmitting = false }: CategoryFormProps) {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  // Define schema for form validation
  const formSchema = z.object({
    name: z.string().min(1, t('Nosaukums ir obligāts', 'Name is required')),
    description: z.string().optional().nullable(),
    priority: z.string().transform(val => parseInt(val) || 999)
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      priority: initialData?.priority?.toString() || '999'
    }
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // When editing, include the ID
      if (initialData?.id) {
        await onSubmit({
          ...data,
          id: initialData.id,
          status: initialData.status,
        });
      } else {
        // For new categories
        await onSubmit({
          ...data,
          status: 'active'
        });
      }
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
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
                <Textarea {...field} value={field.value || ''} />
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('Atcelt', 'Cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 
              (initialData ? t('Saglabā...', 'Saving...') : t('Pievieno...', 'Adding...')) : 
              (initialData ? t('Saglabāt', 'Save') : t('Pievienot', 'Add'))}
          </Button>
        </div>
      </form>
    </Form>
  );
}
