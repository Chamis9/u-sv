
/**
 * Helper function to clean up auth state
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Check if a user's auth session is valid
 */
export const isSessionValid = (session: any): boolean => {
  if (!session) return false;
  
  // Check if session has required properties
  if (!session.access_token || !session.user) {
    return false;
  }
  
  // Check if token is expired
  try {
    const tokenExpiry = JSON.parse(atob(session.access_token.split('.')[1])).exp * 1000;
    if (Date.now() >= tokenExpiry) {
      return false;
    }
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return false;
  }
  
  return true;
};

/**
 * Format user metadata from Supabase Auth into a consistent structure
 */
export const formatUserData = (user: any) => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    first_name: user.user_metadata?.first_name || '',
    last_name: user.user_metadata?.last_name || '',
    phone: user.user_metadata?.phone || ''
  };
};
