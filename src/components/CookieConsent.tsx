
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const COOKIE_CONSENT_KEY = 'cookie-consent-v1';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing?: boolean;
}

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

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        setCookiePreferences(parsedConsent);
      } catch (error) {
        console.error('Error parsing cookie consent', error);
      }
    }
  }, []);

  const handleAccept = (preferences?: Partial<CookiePreferences>) => {
    const finalPreferences = {
      ...cookiePreferences,
      ...preferences
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(finalPreferences));
    setShowBanner(false);
    setShowDialog(false);

    // TODO: Implement actual cookie management based on preferences
    if (finalPreferences.analytics) {
      // Initialize analytics tracking
      console.log('Analytics cookies enabled');
    }
  };

  const handleLearnMore = () => {
    setShowDialog(true);
  };

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
                {cookieConsent.essentialCookiesTitle} (Obligāti)
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

            <div className="mt-4">
              <Button onClick={() => handleAccept()}>
                {cookieConsent.accept}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
