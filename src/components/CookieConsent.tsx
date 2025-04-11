
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const COOKIE_CONSENT_KEY = 'cookie-consent-v2';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Set actual cookies based on preferences
const setCookiesByPreferences = (preferences: CookiePreferences) => {
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

  const { translations, currentLanguage } = useLanguage();
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-sm text-gray-700">
              <p>
                {cookieConsent.message}{' '}
                <button 
                  onClick={handleLearnMore} 
                  className="text-orange-500 hover:underline font-medium"
                >
                  {cookieConsent.learnMore}
                </button>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAccept({ analytics: false, marketing: false })}
                className="border-gray-300"
              >
                {cookieConsent.decline}
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleAccept({ analytics: true })}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {cookieConsent.accept}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{cookieConsent.dialogTitle}</DialogTitle>
            <DialogDescription>
              {cookieConsent.dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm text-gray-700">
            <p>{cookieConsent.whatAreCookies}</p>
            <p>{cookieConsent.whyWeUseCookies}</p>
            <p className="font-medium">{cookieConsent.typesOfCookies}</p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="essential-cookies" 
                checked={cookiePreferences.essential} 
                onCheckedChange={() => {}} 
                disabled 
              />
              <Label 
                htmlFor="essential-cookies"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {cookieConsent.essentialCookiesTitle} ({currentLanguage.code === 'lv' ? 'Obligāti' : currentLanguage.code === 'ru' ? 'Обязательно' : 'Required'})
              </Label>
            </div>
            <p className="pl-6 text-xs">{cookieConsent.essentialCookiesDescription}</p>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="analytics-cookies"
                checked={cookiePreferences.analytics}
                onCheckedChange={(checked) => 
                  setCookiePreferences(prev => ({ ...prev, analytics: !!checked }))
                }
              />
              <Label 
                htmlFor="analytics-cookies"
                className="text-sm font-medium leading-none"
              >
                {cookieConsent.analyticsCookiesTitle}
              </Label>
            </div>
            <p className="pl-6 text-xs">{cookieConsent.analyticsCookiesDescription}</p>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="marketing-cookies"
                checked={cookiePreferences.marketing}
                onCheckedChange={(checked) => 
                  setCookiePreferences(prev => ({ ...prev, marketing: !!checked }))
                }
              />
              <Label 
                htmlFor="marketing-cookies"
                className="text-sm font-medium leading-none"
              >
                {currentLanguage.code === 'lv' 
                  ? 'Mārketinga sīkdatnes' 
                  : currentLanguage.code === 'ru' 
                    ? 'Маркетинговые файлы cookie' 
                    : 'Marketing cookies'}
              </Label>
            </div>
            <p className="pl-6 text-xs">
              {currentLanguage.code === 'lv' 
                ? 'Šīs sīkdatnes tiek izmantotas, lai izsekotu lietotājus dažādās vietnēs un parādītu attiecīgas reklāmas, kas ir aktuālas un saistošas konkrētajam lietotājam.' 
                : currentLanguage.code === 'ru'
                  ? 'Эти файлы cookie используются для отслеживания пользователей на разных веб-сайтах и отображения соответствующей рекламы, которая актуальна и привлекательна для конкретного пользователя.'
                  : 'These cookies are used to track users across websites and display relevant advertisements that are relevant and engaging to the individual user.'}
            </p>
            
            <p className="mt-4">{cookieConsent.privacyPolicy}</p>

            <div className="mt-4">
              <Button onClick={() => handleAccept(cookiePreferences)} className="bg-orange-500 hover:bg-orange-600 text-white">
                {cookieConsent.accept}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
