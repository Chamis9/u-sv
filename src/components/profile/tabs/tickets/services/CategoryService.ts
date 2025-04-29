
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  priority: number | null;
  status: string;
}

/**
 * Maps category names to their respective ticket tables
 * @param name The category name
 * @returns The table name for that category
 */
export function getCategoryTableName(name: string): string {
  const categoryMap: Record<string, string> = {
    'Teātris': 'tickets_theatre',
    'Theatre': 'tickets_theatre',
    'Koncerti': 'tickets_concerts',
    'Concerts': 'tickets_concerts',
    'Sports': 'tickets_sports',
    'Festivāli': 'tickets_festivals',
    'Festivals': 'tickets_festivals',
    'Kino': 'tickets_cinema',
    'Cinema': 'tickets_cinema',
    'Bērniem': 'tickets_children',
    'Children': 'tickets_children',
    'Ceļojumi': 'tickets_travel',
    'Travel': 'tickets_travel',
    'Dāvanu kartes': 'tickets_giftcards',
    'Gift Cards': 'tickets_giftcards'
  };
  
  // Default to 'tickets_other' if no match is found
  return categoryMap[name] || 'tickets_other';
}

/**
 * Fetches a category by its name
 * @param name The name of the category to fetch
 * @returns The category object or null if not found
 */
export async function getCategoryByName(name?: string): Promise<Category | null> {
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

/**
 * Fetches all active categories
 * @returns Array of active categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'active')
    .order('priority', { ascending: true });
  
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Gets a category ID from its name, creating it if it doesn't exist
 * @param name The name of the category
 * @returns The ID of the category or null if there was an error
 */
export async function getCategoryIdByName(name: string): Promise<string | null> {
  try {
    // First try to get the existing category
    const category = await getCategoryByName(name);
    
    // If it exists, return its ID
    if (category) {
      return category.id;
    }
    
    // If not, create a new category with "other" status
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        status: 'active',
        priority: 999 // Low priority for user-created categories
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating category:", error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error("Error in getCategoryIdByName:", err);
    return null;
  }
}
