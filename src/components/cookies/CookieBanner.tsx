import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CookiePreferences } from '../CookieConsent';
import { Translations } from '@/features/language';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/features/language';

interface CookieBannerProps {
  cookieConsent: Translations['cookieConsent'];
  onLearnMore: () => void;
  onAccept: (preferences?: Partial<CookiePreferences>) => void;
}

export function CookieBanner({ cookieConsent, onLearnMore, onAccept }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,  // Always enabled
    analytics: true,  // Default checked
    marketing: false  // Default unchecked
  });

  const { currentLanguage } = useLanguage();

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                onClick={handleDeclineAll}
                className="border-gray-300"
              >
                {cookieConsent.decline}
              </Button>
              <Button 
                size="sm" 
                onClick={handleAcceptAll}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {cookieConsent.accept}
              </Button>
            </div>
          </div>
          
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border rounded-md bg-gray-50 overflow-hidden"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-sm font-medium">
              <span>{cookieConsent.cookieSettings || "Cookie Settings"}</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t bg-white">
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="essential-cookies-banner" 
                    checked={preferences.essential} 
                    disabled
                  />
                  <Label htmlFor="essential-cookies-banner">
                    {cookieConsent.essentialCookiesTitle} ({cookieConsent.required || "Required"})
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="analytics-cookies-banner"
                    checked={preferences.analytics}
                    onCheckedChange={handleToggleAnalytics}
                  />
                  <Label htmlFor="analytics-cookies-banner">
                    {cookieConsent.analyticsCookiesTitle}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="marketing-cookies-banner"
                    checked={preferences.marketing}
                    onCheckedChange={handleToggleMarketing}
                  />
                  <Label htmlFor="marketing-cookies-banner">
                    {cookieConsent.marketingCookies || "Marketing cookies"}
                  </Label>
                </div>
                
                <Button 
                  size="sm" 
                  onClick={handleAcceptSelected}
                  className="bg-orange-500 hover:bg-orange-600 text-white mt-2"
                >
                  {cookieConsent.savePreferences || "Save preferences"}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
