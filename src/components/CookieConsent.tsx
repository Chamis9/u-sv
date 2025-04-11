
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/features/language';
import { CookieBanner } from './cookies/CookieBanner';
import { CookiePreferencesDialog } from './cookies/CookiePreferencesDialog';

const COOKIE_CONSENT_KEY = 'cookie-consent-v2';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Set actual cookies based on preferences
export const setCookiesByPreferences = (preferences: CookiePreferences) => {
  // Set essential cookies - these are always enabled
  document.cookie = "essential_cookies=true; max-age=31536000; path=/; SameSite=Lax";
  
  // Set analytics cookies if allowed
  if (preferences.analytics) {
    document.cookie = "analytics_cookies=true; max-age=31536000; path=/; SameSite=Lax";
  } else {
    // Delete analytics cookies if they exist
    document.cookie = "analytics_cookies=false; max-age=0; path=/; SameSite=Lax";
  }
  
  // Set marketing cookies if allowed
  if (preferences.marketing) {
    document.cookie = "marketing_cookies=true; max-age=31536000; path=/; SameSite=Lax";
  } else {
    // Delete marketing cookies if they exist
    document.cookie = "marketing_cookies=false; max-age=0; path=/; SameSite=Lax";
  }
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false
  });

  const { translations } = useLanguage();
  const { cookieConsent } = translations;

  // Check for existing consent when component mounts
  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        setCookiePreferences(parsedConsent);
        // Apply stored preferences to actual cookies
        setCookiesByPreferences(parsedConsent);
      } catch (error) {
        console.error('Error parsing cookie consent', error);
        setShowBanner(true);
      }
    }
  }, []);

  // Function to handle consent recording
  const handleAccept = (preferences?: Partial<CookiePreferences>) => {
    const finalPreferences = {
      ...cookiePreferences,
      ...preferences
    };

    // Save preferences to localStorage
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(finalPreferences));
    
    // Set actual cookies based on preferences
    setCookiesByPreferences(finalPreferences);
    
    // Update state
    setCookiePreferences(finalPreferences);
    setShowBanner(false);
    setShowDialog(false);

    // Implement actual cookie management based on preferences
    if (finalPreferences.analytics) {
      // Initialize analytics tracking
      console.log('Analytics cookies enabled');
    }
  };

  const handleLearnMore = () => {
    setShowDialog(true);
  };

  // Function to manage cookie preferences through settings
  const handleOpenCookieSettings = () => {
    setShowDialog(true);
  };

  // Function to get cookie consent at any time
  const handleManageCookies = () => {
    setShowBanner(true);
  };

  // Expose these functions globally for other components to use
  useEffect(() => {
    window.openCookieSettings = handleOpenCookieSettings;
    window.manageCookieConsent = handleManageCookies;
    
    // Cleanup
    return () => {
      delete window.openCookieSettings;
      delete window.manageCookieConsent;
    }
  }, []);

  if (!showBanner && !showDialog) {
    return null;
  }

  return (
    <>
      {showBanner && (
        <CookieBanner 
          cookieConsent={cookieConsent}
          onLearnMore={handleLearnMore}
          onAccept={handleAccept}
        />
      )}

      <CookiePreferencesDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        cookiePreferences={cookiePreferences}
        setCookiePreferences={setCookiePreferences}
        onSave={handleAccept}
        cookieConsent={cookieConsent}
      />
    </>
  );
}

// Declare global window interface for TypeScript
declare global {
  interface Window {
    openCookieSettings?: () => void;
    manageCookieConsent?: () => void;
  }
}
