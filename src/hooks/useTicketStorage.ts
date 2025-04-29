
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateUuid } from "@/utils/uuid-helper";

export function useTicketStorage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const uploadTicketFile = async (file: File, userId: string) => {
    if (!file) {
      setError("No file selected");
      return null;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      // Generate a unique filename with original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${generateUuid()}.${fileExt}`;
      const filePath = `tickets/${userId}/${fileName}`;
      
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
      
      return {
        path: filePath,
        url: publicUrl.publicUrl
      };
    } catch (err: any) {
      setError(err.message || "Error uploading file");
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
      
      return true;
    } catch (err: any) {
      setError(err.message || "Error deleting file");
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
