
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { translations, currentLanguage } = useLanguage();
  const { cookieConsent } = translations;

  useEffect(() => {
    // Check if user already accepted cookies
    const hasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  const handleLearnMore = () => {
    setShowDialog(true);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
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
              onClick={() => setShowBanner(false)}
              className="border-gray-300"
            >
              {cookieConsent.decline}
            </Button>
            <Button 
              size="sm" 
              onClick={handleAccept}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {cookieConsent.accept}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{cookieConsent.dialogTitle}</DialogTitle>
            <DialogDescription>
              {cookieConsent.dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm text-gray-700">
            <p>{cookieConsent.whatAreCookies}</p>
            <p>{cookieConsent.whyWeUseCookies}</p>
            <p>{cookieConsent.typesOfCookies}</p>
            <h4 className="font-semibold">{cookieConsent.essentialCookiesTitle}</h4>
            <p>{cookieConsent.essentialCookiesDescription}</p>
            <h4 className="font-semibold">{cookieConsent.analyticsCookiesTitle}</h4>
            <p>{cookieConsent.analyticsCookiesDescription}</p>
            <p>{cookieConsent.privacyPolicy}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
