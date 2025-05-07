
import React, { useState } from "react";
import { User } from "@/types/users";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { PersonalInfoDisplay } from "./PersonalInfoDisplay";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";

interface PersonalInfoCardProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export function PersonalInfoCard({ user, onUserUpdate }: PersonalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <Card className="bg-card dark:bg-gray-900">
      <CardHeader>
        <CardTitle>{t("Personīgā informācija", "Personal Information")}</CardTitle>
        <CardDescription>
          {t(
            "Pārvaldiet savu profila informāciju", 
            "Manage your profile information"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <PersonalInfoForm 
            user={user} 
            onSave={(updatedUser) => {
              onUserUpdate(updatedUser);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-4">
            <PersonalInfoDisplay user={user} />
            <Button 
              onClick={() => setIsEditing(true)}
              className="mt-4"
            >
              {t("Rediģēt", "Edit")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
