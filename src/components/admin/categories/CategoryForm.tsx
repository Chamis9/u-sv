
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
    name_lv: z.string().min(1, t('Nosaukums latviešu valodā ir obligāts', 'Latvian name is required')),
    name_en: z.string().min(1, t('Nosaukums angļu valodā ir obligāts', 'English name is required')),
    name_lt: z.string().optional(),
    name_ee: z.string().optional(),
    description_lv: z.string().optional(),
    description_en: z.string().optional(),
    description_lt: z.string().optional(),
    description_ee: z.string().optional(),
    priority: z.number().default(999)
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_lv: initialData?.name_lv || initialData?.name || '',
      name_en: initialData?.name_en || '',
      name_lt: initialData?.name_lt || '',
      name_ee: initialData?.name_ee || '',
      description_lv: initialData?.description_lv || initialData?.description || '',
      description_en: initialData?.description_en || '',
      description_lt: initialData?.description_lt || '',
      description_ee: initialData?.description_ee || '',
      priority: initialData?.priority ?? 999
    }
  });

  const handleFormSubmit = async (data: FormValues) => {
    try {
      await onSubmit({
        name: data.name_lv, // Keep the main name field as Latvian for backward compatibility
        name_lv: data.name_lv,
        name_en: data.name_en,
        name_lt: data.name_lt,
        name_ee: data.name_ee,
        description: data.description_lv, // Keep the main description field as Latvian for backward compatibility
        description_lv: data.description_lv,
        description_en: data.description_en,
        description_lt: data.description_lt,
        description_ee: data.description_ee,
        priority: data.priority
      });
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name_lv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Nosaukums (LV)', 'Name (LV)')} *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Nosaukums (EN)', 'Name (EN)')} *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name_lt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Nosaukums (LT)', 'Name (LT)')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name_ee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Nosaukums (EE)', 'Name (EE)')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description_lv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Apraksts (LV)', 'Description (LV)')}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Apraksts (EN)', 'Description (EN)')}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_lt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Apraksts (LT)', 'Description (LT)')}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_ee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Apraksts (EE)', 'Description (EE)')}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="priority"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>{t('Prioritāte', 'Priority')}</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  value={value}
                  onChange={e => onChange(Number(e.target.value))}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
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
