import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/users";
import { filterUsers } from "@/utils/user";

export function useRegisteredUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();

  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const fetchRegisteredUsers = async () => {
    setIsLoading(true);
    setError("");
    
    try {
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

  const handleUserUpdated = (updatedUser: User) => {
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    
    const updatedFilteredUsers = filteredUsers.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    setFilteredUsers(updatedFilteredUsers);
  };

  const handleUserDeleted = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    
    const updatedFilteredUsers = filteredUsers.filter(u => u.id !== userId);
    setFilteredUsers(updatedFilteredUsers);
    
    const event = new CustomEvent('userCountUpdated', { 
      detail: { count: updatedUsers.length } 
    });
    window.dispatchEvent(event);
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const updatedUser = {
      ...user,
      status: newStatus as 'active' | 'inactive',
      updated_at: new Date().toISOString()
    };
    
    handleUserUpdated(updatedUser);
    
    supabase
      .from('registered_users')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error toggling user status:", error);
          toast({
            variant: "destructive",
            title: t('Kļūda', 'Error'),
            description: t('Neizdevās mainīt lietotāja statusu', 'Failed to change user status')
          });
        } else {
          toast({
            description: user.status === 'active' 
              ? t('Lietotājs deaktivizēts', 'User deactivated') 
              : t('Lietotājs aktivizēts', 'User activated')
          });
        }
      });
  };

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    fetchRegisteredUsers,
    handleSearch,
    handleUserUpdated,
    handleUserDeleted,
    handleToggleStatus
  };
}
