
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/users";

export function useRegisteredUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();

  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Funkcija, lai ielādētu lietotājus no registered_users tabulas
  const fetchRegisteredUsers = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Iegūt lietotājus no registered_users tabulas
      const { data, error } = await supabase
        .from('registered_users')
        .select('*');
        
      if (error) {
        console.error("Error fetching registered users:", error);
        setError(t('Neizdevās ielādēt lietotājus. Lūdzu, mēģiniet vēlreiz.', 
                   'Failed to load users. Please try again.'));
        setUsers([]);
        setFilteredUsers([]);
      } else {
        console.log("Received registered user data:", data);
        
        // Pārveidot datus User formātā
        const formattedUsers: User[] = data.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          updated_at: user.updated_at,
          role: 'user',
          status: (user.status || 'active') as 'active' | 'inactive'
        }));
        
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        
        // Atjaunināt lietotāju skaitu
        const event = new CustomEvent('userCountUpdated', { 
          detail: { count: formattedUsers.length } 
        });
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.error("Unexpected error in fetchRegisteredUsers:", err);
      setError(t('Neizdevās ielādēt lietotājus. Lūdzu, mēģiniet vēlreiz.', 
               'Failed to load users. Please try again.'));
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Meklēšanas apstrāde
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerSearchTerm = term.toLowerCase();
      const filtered = users.filter(user => 
        user.email?.toLowerCase().includes(lowerSearchTerm) ||
        user.id.toLowerCase().includes(lowerSearchTerm) ||
        user.name?.toLowerCase().includes(lowerSearchTerm) ||
        user.phone?.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle user updates
  const handleUserUpdated = (updatedUser: User) => {
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    
    // Also update filtered users
    const updatedFilteredUsers = filteredUsers.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    setFilteredUsers(updatedFilteredUsers);
  };

  // Handle user deletion
  const handleUserDeleted = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    
    // Also update filtered users
    const updatedFilteredUsers = filteredUsers.filter(u => u.id !== userId);
    setFilteredUsers(updatedFilteredUsers);
    
    // Update user count
    const event = new CustomEvent('userCountUpdated', { 
      detail: { count: updatedUsers.length } 
    });
    window.dispatchEvent(event);
  };

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    fetchRegisteredUsers,
    handleSearch,
    handleUserUpdated,
    handleUserDeleted
  };
}
