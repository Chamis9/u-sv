
import { supabase } from "@/integrations/supabase/client";

export async function getCategoryByName(name?: string) {
  if (!name) return null;
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('name', name)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }
  
  return data;
}
