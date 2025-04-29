
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useUserTickets, AddTicketData } from '@/hooks/useUserTickets';
import { useTicketStorage } from '@/hooks/useTicketStorage';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/features/language";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useCategories } from '@/hooks/useCategories';

const AddTicketForm: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { addTicket } = useUserTickets();
  const { uploadTicketFile, isUploading, uploadProgress } = useTicketStorage();
  const { data: categories } = useCategories();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const form = useForm<AddTicketData>({
    defaultValues: {
      title: '',
      category: '',
      price: 0,
      quantity: 1,
      description: '',
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };
  
  const removeImage = () => {
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };
  
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const onSubmit = async (data: AddTicketData) => {
    try {
      // Upload image if selected
      let imageUrl = '';
      if (selectedImage && imageInputRef.current?.files?.[0]) {
        imageUrl = await uploadTicketFile(imageInputRef.current.files[0]);
      }
      
      // Upload ticket file if selected
      let filePath = '';
      if (selectedFile) {
        filePath = await uploadTicketFile(selectedFile);
      }
      
      // Submit ticket data with file paths
      await addTicket.mutateAsync({
        ...data,
        image_url: imageUrl || undefined,
        file_path: filePath || undefined,
        event_date: selectedDate ? selectedDate.toISOString() : undefined,
      });
      
      // Reset form
      form.reset();
      setSelectedImage(null);
      setSelectedFile(null);
      setSelectedDate(undefined);
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      toast({
        title: t('Biļete pievienota', 'Ticket added'),
        description: t('Biļete veiksmīgi pievienota', 'Ticket was successfully added'),
      });
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast({
        variant: 'destructive',
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās pievienot biļeti', 'Failed to add ticket'),
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Pasākuma nosaukums', 'Event Title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('Ievadiet pasākuma nosaukumu', 'Enter event title')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Kategorija', 'Category')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Izvēlieties kategoriju', 'Select category')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Cena (EUR)', 'Price (EUR)')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Biļešu skaits', 'Number of tickets')}</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormLabel>{t('Pasākuma datums', 'Event date')}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal mt-2"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : t('Izvēlieties datumu', 'Select date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Apraksts', 'Description')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('Ievadiet pasākuma aprakstu', 'Enter event description')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>{t('Biļetes attēls', 'Ticket image')}</FormLabel>
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {t('Augšupielādēt attēlu', 'Upload image')}
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            {selectedImage && (
              <div className="relative">
                <img src={selectedImage} alt="Selected" className="h-16 w-16 object-cover rounded" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <FormLabel>{t('Biļetes fails', 'Ticket file')}</FormLabel>
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {t('Augšupielādēt failu', 'Upload file')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              hidden
            />
            {selectedFile && (
              <div className="flex items-center gap-2">
                <span className="text-sm">{selectedFile.name}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={addTicket.isPending || isUploading}
        >
          {addTicket.isPending || isUploading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              {t('Notiek pievienošana...', 'Adding...')}
              {isUploading && ` (${Math.round(uploadProgress)}%)`}
            </div>
          ) : (
            t('Pievienot biļeti', 'Add ticket')
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddTicketForm;
