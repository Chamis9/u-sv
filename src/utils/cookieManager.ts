
/**
 * Utility functions for managing cookies in the application
 */

// Get a specific cookie by name
export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

// Set a cookie with options
export const setCookie = (
  name: string, 
  value: string, 
  options: { maxAge?: number; path?: string; sameSite?: 'Strict' | 'Lax' | 'None' } = {}
): void => {
  const { maxAge = 31536000, path = '/', sameSite = 'Lax' } = options;
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=${path}; SameSite=${sameSite}`;
};

// Delete a specific cookie by name
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; max-age=0; path=/`;
};

// Clear all cookies set by the application
export const clearAllCookies = (): void => {
  // Delete known application cookies
  deleteCookie('essential_cookies');
  deleteCookie('analytics_cookies');
  deleteCookie('marketing_cookies');
  
  // Additional cookies to be cleared can be added here
  
  // Log that cookies have been cleared
  console.log('All application cookies cleared');
};

// Check if a specific cookie is enabled
export const isCookieEnabled = (type: string): boolean => {
  const cookie = getCookie(`${type}_cookies`);
  return cookie === 'true';
};

// Set cookies based on user preferences
export const setCookiesByPreferences = (preferences: { 
  essential: boolean; 
  analytics: boolean; 
  marketing: boolean; 
}): void => {
  // Essential cookies are always set regardless of preference (they're required)
  setCookie('essential_cookies', 'true');
  
  // Set analytics cookies based on user preference
  setCookie('analytics_cookies', preferences.analytics ? 'true' : 'false');
  
  // Set marketing cookies based on user preference
  setCookie('marketing_cookies', preferences.marketing ? 'true' : 'false');
  
  console.log('Cookie preferences updated:', preferences);
};
