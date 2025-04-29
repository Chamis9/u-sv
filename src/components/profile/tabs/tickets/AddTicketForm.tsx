
import React, { useState } from "react";
import { useLanguage } from "@/features/language";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTicketStorage } from "@/hooks/useTicketStorage";
import { useUserTickets } from "@/hooks/useUserTickets";
import { useAuth } from "@/contexts/AuthContext";
import { LoaderCircle, UploadCloud } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  price: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Price must be a valid number greater than 0" }
  ),
  description: z.string().optional(),
  category: z.string().optional(),
});

interface AddTicketFormProps {
  onClose: () => void;
}

export function AddTicketForm({ onClose }: AddTicketFormProps) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { uploadTicketFile, uploading: fileUploading } = useTicketStorage();
  const { addTicket, loading: ticketLoading } = useUserTickets(user?.id);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: "",
      description: "",
      category: "other"
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is valid (PDF, JPG, PNG)
      const fileType = selectedFile.type;
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      
      if (!validTypes.includes(fileType)) {
        setFileError(t(
          "Neatbalstīts faila formāts. Lūdzu, izvēlieties PDF, JPG vai PNG failu",
          "Unsupported file format. Please select a PDF, JPG or PNG file"
        ));
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setFileError(null);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      return;
    }
    
    try {
      // First upload the file if provided
      let filePath = null;
      let fileUrl = null;
      
      if (file) {
        const uploadResult = await uploadTicketFile(file, user.id);
        if (uploadResult) {
          filePath = uploadResult.path;
          fileUrl = uploadResult.url;
        }
      }
      
      // Then create the ticket entry
      addTicket({
        title: values.title,
        description: values.description,
        price: Number(values.price),
        user_id: user.id,
        file_path: filePath,
        category_name: values.category,
        event_id: null  // Add the missing required property with null value
      });
      
      // Close the form
      onClose();
      
    } catch (err: any) {
      console.error("Error adding ticket:", err);
      form.setError("root", { 
        message: t(
          "Kļūda pievienojot biļeti", 
          "Error adding ticket"
        ) 
      });
    }
  };
  
  const isLoading = fileUploading || ticketLoading;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Nosaukums", "Title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Biļetes nosaukums", "Ticket title")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Cena (€)", "Price (€)")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
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
              <FormLabel>{t("Apraksts", "Description")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("Biļetes apraksts (piem., sēdvieta)", "Ticket description (e.g., seat)")}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>{t("Biļetes fails", "Ticket File")}</FormLabel>
          <div className="border border-input rounded-md p-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  {file ? file.name : t("Izvēlieties failu vai velciet to šeit", "Click to browse or drag and drop")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("PDF, JPG, PNG (max. 10MB)", "PDF, JPG, PNG (max. 10MB)")}
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {fileError && <p className="text-sm text-destructive">{fileError}</p>}
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("Atcelt", "Cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {t("Pievienot biļeti", "Add Ticket")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
