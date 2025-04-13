import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/users";

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState(true); // Default to true, will be updated based on fetch results
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  const cachedUsersRef = useRef<User[]>([]);

  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Optimized search with proper debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (users.length > 0) {
        if (searchTerm.trim() === '') {
          setFilteredUsers(users);
        } else {
          const lowerSearchTerm = searchTerm.toLowerCase();
          const filtered = users.filter(user => 
            (user.email?.toLowerCase().includes(lowerSearchTerm) || false) ||
            user.id.toLowerCase().includes(lowerSearchTerm) ||
            (user.name?.toLowerCase().includes(lowerSearchTerm) || false) ||
            (user.phone?.toLowerCase().includes(lowerSearchTerm) || false)
          );
          setFilteredUsers(filtered);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, users]);

  const fetchAdminUsers = useCallback(async () => {
    // Cancel any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Fetching admin users...");
      
      // Fetch admin users from admin_user table
      const { data, error } = await supabase
        .from('admin_user')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching admin users:", error);
        setError(t('Neizdevās ielādēt administratorus. Lūdzu, mēģiniet vēlreiz.', 
                   'Failed to load administrators. Please try again.'));
        setIsAuth(false);
        
        // Keep showing cached data if available
        if (cachedUsersRef.current.length > 0) {
          setUsers(cachedUsersRef.current);
          setFilteredUsers(cachedUsersRef.current);
        } else {
          setUsers([]);
          setFilteredUsers([]);
        }
      } else {
        console.log("Received admin user data:", data);
        setIsAuth(true);
        
        const formattedUsers: User[] = data.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: user.email, // Admin users may not have separate name field
          phone: null,
          created_at: user.created_at,
          last_sign_in_at: null,
          updated_at: null,
          role: 'admin',
          status: 'active' as 'active' | 'inactive'
        }));
        
        // Cache the users for future use
        cachedUsersRef.current = formattedUsers;
        
        setUsers(formattedUsers);
        
        // Only apply filter if there's a search term
        if (searchTerm.trim() !== '') {
          const lowerSearchTerm = searchTerm.toLowerCase();
          const filtered = formattedUsers.filter(user => 
            (user.email?.toLowerCase().includes(lowerSearchTerm) || false) ||
            user.id.toLowerCase().includes(lowerSearchTerm) ||
            (user.name?.toLowerCase().includes(lowerSearchTerm) || false) ||
            (user.phone?.toLowerCase().includes(lowerSearchTerm) || false)
          );
          setFilteredUsers(filtered);
        } else {
          setFilteredUsers(formattedUsers);
        }
        
        const event = new CustomEvent('adminCountUpdated', { 
          detail: { count: formattedUsers.length } 
        });
        window.dispatchEvent(event);
      }
    } catch (err) {
      // Only set error if this wasn't an abort error
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error("Unexpected error in fetchAdminUsers:", err);
        setError(t('Neizdevās ielādēt administratorus. Lūdzu, mēģiniet vēlreiz.', 
                'Failed to load administrators. Please try again.'));
        setIsAuth(false);
      }
    } finally {
      // Only update loading state if this wasn't aborted
      if (abortControllerRef.current?.signal.aborted === false) {
        setIsLoading(false);
      }
    }
  }, [currentLanguage.code, t, searchTerm]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleUserUpdated = (updatedUser: User) => {
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    
    // Update the cache
    cachedUsersRef.current = updatedUsers;
    setUsers(updatedUsers);
    
    // Only update filtered users if the updated user is in the filtered list
    if (filteredUsers.some(u => u.id === updatedUser.id)) {
      const updatedFilteredUsers = filteredUsers.map(u => 
        u.id === updatedUser.id ? updatedUser : u
      );
      setFilteredUsers(updatedFilteredUsers);
    }
  };

  const handleUserDeleted = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    
    // Update the cache
    cachedUsersRef.current = updatedUsers;
    setUsers(updatedUsers);
    
    const updatedFilteredUsers = filteredUsers.filter(u => u.id !== userId);
    setFilteredUsers(updatedFilteredUsers);
    
    const event = new CustomEvent('adminCountUpdated', { 
      detail: { count: updatedUsers.length } 
    });
    window.dispatchEvent(event);
  };

  return {
    users: filteredUsers,
    searchTerm,
    isLoading,
    error,
    isAuth,
    fetchAdminUsers,
    handleSearch,
    handleUserUpdated,
    handleUserDeleted
  };
}
