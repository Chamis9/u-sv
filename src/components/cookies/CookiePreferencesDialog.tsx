
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
import { Translations } from '@/features/language';

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
  const { currentLanguage } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button onClick={() => onSave(cookiePreferences)} className="bg-orange-500 hover:bg-orange-600 text-white">
              {cookieConsent.accept}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
