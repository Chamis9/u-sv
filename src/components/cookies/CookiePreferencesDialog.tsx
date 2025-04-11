
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CookiePreferences } from '../CookieConsent';
import { useLanguage } from '@/features/language';
import { Translations } from '@/features/language/types';

interface CookiePreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cookiePreferences: CookiePreferences;
  setCookiePreferences: React.Dispatch<React.SetStateAction<CookiePreferences>>;
  onSave: (preferences: CookiePreferences) => void;
  cookieConsent: Translations['cookieConsent'];
}

export function CookiePreferencesDialog({
  open,
  onOpenChange,
  cookiePreferences,
  setCookiePreferences,
  onSave,
  cookieConsent
}: CookiePreferencesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-b from-black via-gray-900 to-gray-800 text-gray-300 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-orange-500">{cookieConsent.dialogTitle}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {cookieConsent.dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm text-gray-300">
          <p>{cookieConsent.whatAreCookies}</p>
          <p>{cookieConsent.whyWeUseCookies}</p>
          <p className="font-medium text-orange-500">{cookieConsent.typesOfCookies}</p>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="essential-cookies" 
              checked={cookiePreferences.essential} 
              onCheckedChange={() => {}} 
              disabled 
              className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <Label 
              htmlFor="essential-cookies"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {cookieConsent.essentialCookiesTitle} ({cookieConsent.required || "Required"})
            </Label>
          </div>
          <p className="pl-6 text-xs text-gray-400">{cookieConsent.essentialCookiesDescription}</p>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="analytics-cookies"
              checked={cookiePreferences.analytics}
              onCheckedChange={(checked) => 
                setCookiePreferences(prev => ({ ...prev, analytics: !!checked }))
              }
              className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <Label 
              htmlFor="analytics-cookies"
              className="text-sm font-medium leading-none"
            >
              {cookieConsent.analyticsCookiesTitle}
            </Label>
          </div>
          <p className="pl-6 text-xs text-gray-400">{cookieConsent.analyticsCookiesDescription}</p>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="marketing-cookies"
              checked={cookiePreferences.marketing}
              onCheckedChange={(checked) => 
                setCookiePreferences(prev => ({ ...prev, marketing: !!checked }))
              }
              className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <Label 
              htmlFor="marketing-cookies"
              className="text-sm font-medium leading-none"
            >
              {cookieConsent.marketingCookies || "Marketing cookies"}
            </Label>
          </div>
          <p className="pl-6 text-xs text-gray-400">
            {cookieConsent.marketingCookiesDescription || "These cookies are used to track users across websites and display advertisements that are relevant to the individual user."}
          </p>
          
          <p className="mt-4 text-gray-400">{cookieConsent.privacyPolicy}</p>

          <div className="mt-4">
            <Button onClick={() => onSave(cookiePreferences)} className="bg-orange-500 hover:bg-orange-600 text-white">
              {cookieConsent.savePreferences || cookieConsent.accept}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
