
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTicketFile = () => {
  const { isAuthenticated } = useAuth();
  
  const getTicketFile = async (filePath: string): Promise<string | null> => {
    if (!isAuthenticated) return null;
    
    try {
      const { data, error } = await supabase.storage
        .from('ticket_files')
        .createSignedUrl(filePath, 3600); // URL expires in 1 hour
      
      if (error || !data) {
        console.error('Error getting signed URL:', error);
        return null;
      }
      
      return data.signedUrl;
    } catch (error) {
      console.error('Exception getting ticket file:', error);
      return null;
    }
  };

  return {
    getTicketFile
  };
};
