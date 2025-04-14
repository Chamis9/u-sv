
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { PhoneInputWithCountry } from "./PhoneInputWithCountry";

interface AddUserFormProps {
  formData: {
    name: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
  };
  errors: {
    email?: string;
    phone?: string;
  };
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onInputChange: (field: string, value: string) => void;
  t: (lvText: string, enText: string) => string;
}

export function AddUserForm({
  formData,
  errors,
  isSubmitting,
  onSubmit,
  onClose,
  onInputChange,
  t
}: AddUserFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="name">{t('Vārds', 'Name')}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder={t('Ievadiet lietotāja vārdu', 'Enter user name')}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">{t('E-pasts', 'Email')} *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder={t('Ievadiet e-pasta adresi', 'Enter email address')}
          required
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>
      
      <PhoneInputWithCountry
        label={t('Telefons', 'Phone')}
        countryCode={formData.countryCode}
        phoneNumber={formData.phoneNumber}
        onCountryCodeChange={(code) => onInputChange('countryCode', code)}
        onPhoneNumberChange={(number) => onInputChange('phoneNumber', number)}
        error={errors.phone}
        placeholder={t('Ievadiet telefona numuru', 'Enter phone number')}
      />
      
      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          {t('Atcelt', 'Cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('Pievieno...', 'Adding...') : t('Pievienot', 'Add')}
        </Button>
      </DialogFooter>
    </form>
  );
}
