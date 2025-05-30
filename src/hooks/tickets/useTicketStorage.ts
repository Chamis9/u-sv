
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateUuid } from "@/utils/uuid-helper";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";

interface FileUploadResult {
  path?: string;
  url?: string;
  error?: string;
}

export function useTicketStorage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const createTicketsBucket = async () => {
    try {
      // Check if tickets bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const ticketsBucket = buckets?.find(bucket => bucket.name === 'tickets');
      
      if (!ticketsBucket) {
        // Create the bucket if it doesn't exist
        const { data, error } = await supabase.storage.createBucket('tickets', {
          public: true,
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (error) {
          console.error("Error creating bucket:", error);
          return false;
        }
        
        console.log("Created tickets bucket successfully");
      } else {
        console.log("Tickets bucket already exists");
      }
      return true;
    } catch (err) {
      console.error("Error creating bucket:", err);
      return false;
    }
  };
  
  const uploadTicketFile = async (file: File): Promise<FileUploadResult> => {
    if (!file) {
      const errorMessage = t("Nav izvēlēts fails", "No file selected");
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error"),
        description: errorMessage,
      });
      return { error: errorMessage };
    }
    
    try {
      setUploading(true);
      setError(null);
      
      // Get current user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        const errorMessage = t("Nepieciešama autentifikācija", "Authentication required");
        throw new Error(errorMessage);
      }
      
      const userId = sessionData.session.user.id;
      
      // Check if the file is valid (PDF, JPG, PNG)
      const fileType = file.type;
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      
      if (!validTypes.includes(fileType)) {
        throw new Error(t(
          "Neatbalstīts faila formāts. Lūdzu, izvēlieties PDF, JPG vai PNG failu", 
          "Unsupported file format. Please select a PDF, JPG or PNG file"
        ));
      }
      
      // Ensure tickets bucket exists
      const bucketCreated = await createTicketsBucket();
      if (!bucketCreated) {
        throw new Error(t(
          "Nevarēja izveidot vai piekļūt biļešu krātuvei", 
          "Could not create or access tickets storage"
        ));
      }
      
      // Generate a unique filename with original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${generateUuid()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      console.log("Uploading file to path:", filePath);
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('tickets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
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
      
      console.log("File uploaded successfully", publicUrl);
      
      return {
        path: filePath,
        url: publicUrl.publicUrl
      };
    } catch (err: any) {
      const errorMessage = err.message || t("Kļūda augšupielādējot failu", "Error uploading file");
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error"),
        description: errorMessage,
      });
      console.error("Upload error:", err);
      return { error: errorMessage };
    } finally {
      setUploading(false);
    }
  };
  
  const deleteTicketFile = async (path: string) => {
    if (!path) return true;
    
    try {
      setError(null);
      
      // Get the current authenticated user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error(t("Nepieciešama autentifikācija", "Authentication required"));
      }
      
      const { error } = await supabase.storage
        .from('tickets')
        .remove([path]);
      
      if (error) {
        console.error("Delete error:", error);
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
