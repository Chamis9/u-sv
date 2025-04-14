
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { PhoneInputWithCountry } from "./PhoneInputWithCountry";
import type { User } from "@/types/users";

interface EditUserFormProps {
  user: User;
  formData: {
    name: string | null;
    countryCode: string;
    phoneNumber: string;
  };
  errors: {
    phone?: string;
  };
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onInputChange: (field: string, value: string) => void;
  t: (lvText: string, enText: string) => string;
}

export function EditUserForm({
  user,
  formData,
  errors,
  isSubmitting,
  onSubmit,
  onClose,
  onInputChange,
  t
}: EditUserFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            {t('E-pasts', 'Email')}
          </Label>
          <Input
            id="email"
            value={user.email || ''}
            className="col-span-3"
            disabled
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            {t('Vārds', 'Name')}
          </Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="col-span-3"
            placeholder={t('Ievadiet vārdu', 'Enter name')}
          />
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="phone" className="text-right mt-2">
            {t('Tālrunis', 'Phone')}
          </Label>
          <div className="col-span-3">
            <PhoneInputWithCountry
              label=""
              countryCode={formData.countryCode}
              phoneNumber={formData.phoneNumber}
              onCountryCodeChange={(code) => onInputChange('countryCode', code)}
              onPhoneNumberChange={(number) => onInputChange('phoneNumber', number)}
              error={errors.phone}
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onClose}>
          {t('Atcelt', 'Cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 
            t('Saglabā...', 'Saving...') : 
            t('Saglabāt izmaiņas', 'Save changes')}
        </Button>
      </DialogFooter>
    </form>
  );
}
