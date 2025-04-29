
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from '@/utils/uuid-helper';

interface UploadOptions {
  onProgress?: (progress: number) => void;
}

export const useTicketStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadTicketFile = async (file: File, options?: UploadOptions): Promise<string> => {
    if (!file) {
      throw new Error('No file provided');
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      const fullPath = `tickets/${filePath}`;
      
      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('tickets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Update progress
      setUploadProgress(100);
      options?.onProgress?.(100);
      
      // Get the public URL for the file
      const { data: urlData } = supabase.storage
        .from('tickets')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const deleteTicketFile = async (filePath: string): Promise<void> => {
    if (!filePath) return;
    
    try {
      // Extract the filename from the URL or path
      const pathParts = filePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      const { error } = await supabase.storage
        .from('tickets')
        .remove([fileName]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };
  
  return {
    uploadTicketFile,
    deleteTicketFile,
    isUploading,
    uploadProgress,
    uploadError
  };
};
