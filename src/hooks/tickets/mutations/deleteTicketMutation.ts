
import { supabase } from "@/integrations/supabase/client";

export async function deleteTicketMutation(ticketId: string, userId: string): Promise<boolean> {
  try {
    console.log(`Deleting ticket with ID: ${ticketId}, User ID: ${userId}`);
    
    const { error } = await supabase
      .from('tickets')
      .delete()
      .match({ id: ticketId, owner_id: userId });
      
    if (error) {
      console.error(`Error deleting ticket:`, error);
      throw error;
    }
    
    console.log(`Successfully deleted ticket`);
    return true;
  } catch (err) {
    console.error('Error in deleteTicketMutation:', err);
    return false;
  }
}
