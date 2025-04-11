
import React from 'react';
import { Button } from '@/components/ui/button';
import { CookiePreferences } from '../CookieConsent';
import { Translations } from '@/features/language';

interface CookieBannerProps {
  cookieConsent: Translations['cookieConsent'];
  onLearnMore: () => void;
  onAccept: (preferences?: Partial<CookiePreferences>) => void;
}

export function CookieBanner({ cookieConsent, onLearnMore, onAccept }: CookieBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-700">
          <p>
            {cookieConsent.message}{' '}
            <button 
              onClick={onLearnMore} 
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
            onClick={() => onAccept({ analytics: false, marketing: false })}
            className="border-gray-300"
          >
            {cookieConsent.decline}
          </Button>
          <Button 
            size="sm" 
            onClick={() => onAccept({ analytics: true })}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {cookieConsent.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
