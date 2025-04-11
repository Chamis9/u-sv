
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CookiePreferences } from '../CookieConsent';
import { Translations } from '@/features/language';
import { useLanguage } from '@/features/language';

interface CookieBannerProps {
  cookieConsent: Translations['cookieConsent'];
  onLearnMore: () => void;
  onAccept: (preferences?: Partial<CookiePreferences>) => void;
}

export function CookieBanner({ cookieConsent, onLearnMore, onAccept }: CookieBannerProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,  // Always enabled
    analytics: true,  // Default checked
    marketing: false  // Default unchecked
  });

  const handleToggleAnalytics = (checked: boolean) => {
    setPreferences(prev => ({ ...prev, analytics: checked }));
  };

  const handleToggleMarketing = (checked: boolean) => {
    setPreferences(prev => ({ ...prev, marketing: checked }));
  };

  const handleAcceptSelected = () => {
    onAccept(preferences);
  };

  const handleAcceptAll = () => {
    onAccept({ essential: true, analytics: true, marketing: true });
  };
  
  const handleDeclineAll = () => {
    onAccept({ essential: true, analytics: false, marketing: false });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background text-foreground p-4">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 text-sm">
              <p>
                {cookieConsent.message}{' '}
                <button 
                  onClick={onLearnMore} 
                  className="text-primary hover:underline font-medium"
                >
                  {cookieConsent.learnMore}
                </button>
              </p>
            </div>
          </div>
          
          <div className="bg-secondary/20 p-4 rounded-md">
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="essential-cookies-banner" 
                  checked={preferences.essential} 
                  disabled
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="essential-cookies-banner" className="text-foreground">
                  {cookieConsent.essentialCookiesTitle} ({cookieConsent.required || "Required"})
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="analytics-cookies-banner"
                  checked={preferences.analytics}
                  onCheckedChange={handleToggleAnalytics}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="analytics-cookies-banner" className="text-foreground">
                  {cookieConsent.analyticsCookiesTitle}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="marketing-cookies-banner"
                  checked={preferences.marketing}
                  onCheckedChange={handleToggleMarketing}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="marketing-cookies-banner" className="text-foreground">
                  {cookieConsent.marketingCookies || "Marketing cookies"}
                </Label>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeclineAll}
                >
                  {cookieConsent.decline}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAcceptSelected}
                  variant="secondary"
                >
                  {cookieConsent.savePreferences || "Save preferences"}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAcceptAll}
                  variant="default"
                >
                  {cookieConsent.accept}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
