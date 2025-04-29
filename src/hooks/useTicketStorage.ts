
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateUuid } from "@/utils/uuid-helper";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";

export function useTicketStorage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const uploadTicketFile = async (file: File, userId: string) => {
    if (!file) {
      setError(t("Nav izvēlēts fails", "No file selected"));
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error"),
        description: t("Nav izvēlēts fails", "No file selected"),
      });
      return null;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      // Check if the file is valid (PDF, JPG, PNG)
      const fileType = file.type;
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      
      if (!validTypes.includes(fileType)) {
        throw new Error(t(
          "Neatbalstīts faila formāts. Lūdzu, izvēlieties PDF, JPG vai PNG failu", 
          "Unsupported file format. Please select a PDF, JPG or PNG file"
        ));
      }
      
      // Check if tickets bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'tickets')) {
        await supabase.storage.createBucket('tickets', {
          public: true,
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
          fileSizeLimit: 10485760, // 10MB
        });
      }
      
      // Generate a unique filename with original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${generateUuid()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError, data } = await supabase.storage
        .from('tickets')
        .upload(filePath, file, {
          cacheControl: '3600'
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('tickets')
        .getPublicUrl(filePath);
      
      toast({
        title: t("Fails augšupielādēts", "File uploaded"),
        description: t("Biļetes fails veiksmīgi augšupielādēts", "Ticket file successfully uploaded"),
      });
      
      return {
        path: filePath,
        url: publicUrl.publicUrl
      };
    } catch (err: any) {
      setError(err.message || t("Kļūda augšupielādējot failu", "Error uploading file"));
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error"),
        description: err.message || t("Kļūda augšupielādējot failu", "Error uploading file"),
      });
      console.error("Upload error:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  const deleteTicketFile = async (path: string) => {
    try {
      setError(null);
      const { error } = await supabase.storage
        .from('tickets')
        .remove([path]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t("Fails dzēsts", "File deleted"),
        description: t("Biļetes fails veiksmīgi dzēsts", "Ticket file successfully deleted"),
      });
      
      return true;
    } catch (err: any) {
      setError(err.message || t("Kļūda dzēšot failu", "Error deleting file"));
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error"),
        description: err.message || t("Kļūda dzēšot failu", "Error deleting file"),
      });
      console.error("Delete error:", err);
      return false;
    }
  };
  
  return {
    uploadTicketFile,
    deleteTicketFile,
    uploading,
    error
  };
}
