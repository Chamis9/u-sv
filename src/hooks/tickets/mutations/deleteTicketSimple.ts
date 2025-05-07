
import { supabase } from "@/integrations/supabase/client";

export async function deleteTicketSimple(ticketId: string): Promise<boolean> {
  if (!ticketId) {
    console.error('Missing required parameter: ticketId');
    return false;
  }

  try {
    console.log(`Simple delete for ticket with ID: ${ticketId}`);
    
    // Direct delete approach
    const { data, error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId)
      .select();
      
    if (error) {
      console.error('Error in simple delete:', error);
      return false;
    }
    
    console.log(`Simple delete result:`, data);
    return true;
  } catch (err) {
    console.error('Error in deleteTicketSimple:', err);
    return false;
  }
}
