
import { supabase } from "@/integrations/supabase/client";

export async function deleteTicketMutation(ticketId: string, userId: string): Promise<boolean> {
  if (!ticketId || !userId) {
    console.error('Missing required parameters: ticketId or userId');
    return false;
  }

  try {
    console.log(`Deleting ticket with ID: ${ticketId}, User ID: ${userId}`);
    
    // Verify the ticket exists and belongs to the user before deletion
    const { data: ticketData, error: checkError } = await supabase
      .from('tickets')
      .select('id, file_path')
      .eq('id', ticketId)
      .eq('owner_id', userId)
      .single();
      
    if (checkError || !ticketData) {
      console.error(`Error verifying ticket ownership:`, checkError || 'Ticket not found');
      return false;
    }
    
    // If ticket has a file, delete it from storage first
    if (ticketData.file_path) {
      console.log(`Deleting ticket file: ${ticketData.file_path}`);
      const { error: storageError } = await supabase
        .storage
        .from('tickets')
        .remove([ticketData.file_path]);
        
      if (storageError) {
        console.warn(`Warning: couldn't delete ticket file:`, storageError);
        // Continue with ticket deletion even if file deletion fails
      }
    }
    
    // Delete the ticket from the database
    const { error } = await supabase
      .from('tickets')
      .delete()
      .match({ id: ticketId, owner_id: userId });
      
    if (error) {
      console.error(`Error deleting ticket:`, error);
      throw error;
    }
    
    console.log(`Successfully deleted ticket with ID: ${ticketId}`);
    return true;
  } catch (err) {
    console.error('Error in deleteTicketMutation:', err);
    return false;
  }
}
