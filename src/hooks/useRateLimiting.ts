
import { useState } from 'react';

export function useRateLimiting(limitInMs: number = 60000) {
  const [formError, setFormError] = useState("");
  
  const checkRateLimit = (errorMessage: string): boolean => {
    try {
      const now = Date.now();
      const lastSubmit = sessionStorage.getItem('lastEmailSubmit');
      
      if (lastSubmit && now - parseInt(lastSubmit) < limitInMs) {
        setFormError(errorMessage);
        return false;
      }
      
      // Update last submit time
      sessionStorage.setItem('lastEmailSubmit', now.toString());
      return true;
    } catch (error) {
      // If sessionStorage fails, continue anyway
      console.error("Error with session storage:", error);
      return true;
    }
  };
  
  return {
    formError,
    setFormError,
    checkRateLimit
  };
}
