
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (lvText: string, enText: string) => string;
}

export function PersonalInfoForm({ formData, onChange, t }: PersonalInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("Vārds", "Name")}</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder={t("Ievadiet savu vārdu", "Enter your name")}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t("E-pasts", "Email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder={t("Ievadiet savu e-pastu", "Enter your email")}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">{t("Tālrunis", "Phone")}</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder={t("Ievadiet savu tālruni", "Enter your phone")}
        />
      </div>
    </div>
  );
}
