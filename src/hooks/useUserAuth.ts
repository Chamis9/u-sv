import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { cleanupAuthState } from '@/utils/auth/authUtils'; // Updated import path

export function useUserAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        setIsAuth(!!data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email || 'No session');
          setIsAuth(!!session);
          setUser(session?.user || null);
          
          // If signed in, make sure to update user data after a short delay
          if (event === 'SIGNED_IN' && session) {
            setTimeout(() => {
              console.log('Updating user data after sign in');
              checkIfUserInRegisteredUsers(session.user);
            }, 0);
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);

  // Function to check if user exists in registered_users and create if not
  const checkIfUserInRegisteredUsers = async (authUser) => {
    if (!authUser || !authUser.email) return;
    
    try {
      // Check if user exists in registered_users
      const { data: existingUser, error: checkError } = await supabase
        .from('registered_users')
        .select('*')
        .eq('email', authUser.email)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking user in registered_users:', checkError);
        return;
      }
      
      // If user doesn't exist in registered_users table, create them
      if (!existingUser) {
        console.log('User not found in registered_users, creating now');
        
        const userData = {
          auth_user_id: authUser.id,
          email: authUser.email,
          first_name: authUser.user_metadata?.first_name || null,
          last_name: authUser.user_metadata?.last_name || null,
          phone: authUser.user_metadata?.phone || null,
          last_sign_in_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('registered_users')
          .insert([userData]);
          
        if (insertError) {
          console.error('Error creating user in registered_users:', insertError);
        } else {
          console.log('Successfully created user in registered_users table');
        }
      } else {
        // Update last_sign_in_at for existing users
        const { error: updateError } = await supabase
          .from('registered_users')
          .update({ last_sign_in_at: new Date().toISOString() })
          .eq('email', authUser.email);
          
        if (updateError) {
          console.error('Error updating last_sign_in_at:', updateError);
        }
      }
    } catch (error) {
      console.error('Error in checkIfUserInRegisteredUsers:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Try global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      console.log('Login successful, user data:', data);
      
      // Check if user exists in registered_users table
      if (data.user) {
        setTimeout(() => {
          checkIfUserInRegisteredUsers(data.user);
        }, 0);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting registration process for:', email);
      setIsLoading(true);
      
      // Clean up auth state before registering
      cleanupAuthState();
      
      // Clean format for user metadata
      const userMetadata = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phoneNumber ? `${userData.countryCode}${userData.phoneNumber}` : null,
      };
      
      // Simplified options without email redirect
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      console.log('Registration successful, user data:', data);
      
      // Manually insert the user into registered_users table to ensure they're added
      if (data.user) {
        const registeredUserData = {
          auth_user_id: data.user.id,
          email: data.user.email,
          first_name: userMetadata.first_name,
          last_name: userMetadata.last_name,
          phone: userMetadata.phone,
          last_sign_in_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('registered_users')
          .insert([registeredUserData]);
          
        if (insertError) {
          console.error('Error creating user in registered_users:', insertError);
        } else {
          console.log('Successfully created user in registered_users table');
        }
      }
      
      // Auto login after registration if no email confirmation is required
      if (data.user && !data.user.confirmed_at && !data.user.email_confirmed_at) {
        console.log('User registered but email not confirmed yet.');
      }
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process');
      
      // Clean up auth state
      cleanupAuthState();
      
      await supabase.auth.signOut();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { isAuth, isLoading, user, login, register, logout };
}
