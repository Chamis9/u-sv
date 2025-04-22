
import { supabase } from "@/integrations/supabase/client";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const sendContactFormEmail = async (formData: ContactFormData) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-user-email', {
      body: {
        name: formData.name,
        email: formData.email,
        message: formData.message
      }
    });
    
    if (error) {
      console.error('Error sending message:', error);
      throw new Error(error.message || 'Failed to send email');
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Email sending error:', error);
    throw error;
  }
};
