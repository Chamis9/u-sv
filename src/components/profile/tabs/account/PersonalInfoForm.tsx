
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/types/users";

interface PersonalInfoFormProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
  t: (lvText: string, enText: string, ltText: string, eeText: string) => string;
}

export function PersonalInfoForm({ user, onSave, onCancel, t }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || ''
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="first_name">
          {t("Vārds", "First Name", "Vardas", "Eesnimi")}
        </Label>
        <Input
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={onChange}
          placeholder={t("Ievadiet vārdu", "Enter your first name", "Įveskite vardą", "Sisestage eesnimi")}
        />
      </div>
      
      <div>
        <Label htmlFor="last_name">
          {t("Uzvārds", "Last Name", "Pavardė", "Perekonnanimi")}
        </Label>
        <Input
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={onChange}
          placeholder={t("Ievadiet uzvārdu", "Enter your last name", "Įveskite pavardę", "Sisestage perekonnanimi")}
        />
      </div>
      
      <div>
        <Label htmlFor="email">
          {t("E-pasts", "Email", "El. paštas", "E-post")}
        </Label>
        <Input
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder={t("Ievadiet e-pastu", "Enter your email", "Įveskite el. paštą", "Sisestage e-post")}
          type="email"
        />
      </div>
      
      <div>
        <Label htmlFor="phone">
          {t("Tālrunis", "Phone", "Telefonas", "Telefon")}
        </Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder={t("Ievadiet tālruni", "Enter your phone", "Įveskite telefoną", "Sisestage telefon")}
        />
      </div>

      <div className="flex space-x-2 pt-2">
        <Button type="submit">
          {t("Saglabāt", "Save", "Išsaugoti", "Salvesta")}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("Atcelt", "Cancel", "Atšaukti", "Tühista")}
        </Button>
      </div>
    </form>
  );
}
