
import { User } from "@/types/users";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useUserUpdates() {
  const { toast } = useToast();

  const handleUserUpdate = async (user: User, updatedUser: User) => {
    // Check if this is a demo user
    if (updatedUser.id.startsWith('mock-user-id')) {
      // For demo users, we just return the updated state
      
      // If avatar changed, store it in localStorage
      if (updatedUser.avatar_url && updatedUser.avatar_url !== user?.avatar_url) {
        localStorage.setItem('demo_user_avatar', updatedUser.avatar_url);
      }
      
      return updatedUser;
    }
    
    try {
      // Update user in database via RPC function instead of direct query
      const { error } = await supabase.rpc('update_user_profile', {
        user_id: updatedUser.id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone
      });
        
      if (error) {
        throw error;
      }
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Kļūda",
        description: "Neizdevās atjaunināt lietotāja datus"
      });
      
      // Return the original user object on error
      return user;
    }
  };

  return { handleUserUpdate };
}
