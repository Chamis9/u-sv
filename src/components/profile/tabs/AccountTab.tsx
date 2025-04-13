
import React, { useState } from "react";
import { User } from "@/types/users";
import { useLanguage } from "@/features/language";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "../UserAvatar";
import { 
  Edit, 
  Save, 
  X as Cancel,
  Upload
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AccountTabProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export function AccountTab({ user, onUserUpdate }: AccountTabProps) {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || ""
  });
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    // Izveidojam atjauninātu lietotāja objektu
    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      updated_at: new Date().toISOString()
    };
    
    // Atjauninām lietotāja datus
    onUserUpdate(updatedUser);
    setIsEditing(false);
    
    // Parādām paziņojumu par veiksmīgu saglabāšanu
    toast({
      description: t("Konta informācija veiksmīgi atjaunināta", "Account information successfully updated"),
    });
  };
  
  const handleCancel = () => {
    // Atjaunojam sākotnējos datus
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || ""
    });
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("Personīgā informācija", "Personal Information")}</CardTitle>
          
          {isEditing ? (
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <Cancel className="h-4 w-4 mr-2" />
                {t("Atcelt", "Cancel")}
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {t("Saglabāt", "Save")}
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              {t("Rediģēt", "Edit")}
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <UserAvatar user={user} size="lg" />
              
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {t("Augšupielādēt attēlu", "Upload Image")}
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("Vārds", "Name")}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
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
                      onChange={handleChange}
                      placeholder={t("Ievadiet savu e-pastu", "Enter your email")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("Tālrunis", "Phone")}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t("Ievadiet savu tālruni", "Enter your phone")}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">{t("Vārds", "Name")}</Label>
                      <p>{user.name || t("Nav norādīts", "Not specified")}</p>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">{t("E-pasts", "Email")}</Label>
                      <p>{user.email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">{t("Tālrunis", "Phone")}</Label>
                      <p>{user.phone || t("Nav norādīts", "Not specified")}</p>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">{t("Statuss", "Status")}</Label>
                      <p className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {user.status === 'active' ? t("Aktīvs", "Active") : t("Neaktīvs", "Inactive")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("Konta drošība", "Account Security")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("Parole", "Password")}</Label>
            <div className="flex items-center">
              <p className="flex-1">••••••••</p>
              <Button variant="outline" size="sm">{t("Mainīt paroli", "Change Password")}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
