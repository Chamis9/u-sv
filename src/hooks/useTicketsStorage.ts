
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useTicketsStorage = () => {
  // Initialize storage bucket if it doesn't exist
  const initializeStorage = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('tickets');
      
      if (error && error.message.includes('does not exist')) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket('tickets', {
          public: false,
          fileSizeLimit: 10485760, // 10MB limit
        });
        console.log('Created tickets storage bucket');
      }
    } catch (error) {
      console.error('Error initializing tickets storage:', error);
    }
  }, []);

  // Get a public URL for a file
  const getFileUrl = useCallback(async (path: string) => {
    if (!path) return null;
    
    try {
      const { data } = await supabase.storage
        .from('tickets')
        .createSignedUrl(path, 60 * 60); // 1 hour expiry
      
      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error getting ticket file URL:', error);
      return null;
    }
  }, []);

  // Delete a file
  const deleteFile = useCallback(async (path: string) => {
    if (!path) return;
    
    try {
      await supabase.storage
        .from('tickets')
        .remove([path]);
    } catch (error) {
      console.error('Error deleting ticket file:', error);
    }
  }, []);

  return {
    initializeStorage,
    getFileUrl,
    deleteFile
  };
};
