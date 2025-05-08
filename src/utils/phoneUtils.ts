
import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_email_exists', { check_email: email });
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    return false;
  }
};

export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_phone_exists', { check_phone: phone });
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if phone exists:", error);
    return false;
  }
};
