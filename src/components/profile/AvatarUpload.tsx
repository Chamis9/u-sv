
import React, { useState, useRef } from "react";
import { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { Upload, Loader2 } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploadProps {
  user: User;
  onAvatarUpdate: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({ user, onAvatarUpdate, size = "lg" }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error", "Ошибка"),
        description: t(
          "Lūdzu, izvēlieties attēla failu",
          "Please select an image file",
          "Пожалуйста, выберите файл изображения"
        )
      });
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error", "Ошибка"),
        description: t(
          "Attēls ir pārāk liels. Maksimālais izmērs ir 2MB",
          "Image is too large. Maximum size is 2MB",
          "Изображение слишком большое. Максимальный размер - 2МБ"
        )
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Special handling for demo user - store avatar in localStorage instead
      if (user.id.startsWith('mock-user-id')) {
        handleDemoUserAvatar(file);
        return;
      }
      
      // Create a unique file path using user ID and timestamp
      const userId = user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      console.log("Upload successful, public URL:", publicUrl);
      
      // Update the user's avatar URL in the database
      const { error: updateError } = await supabase
        .from('registered_users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        console.error("Database update error:", updateError);
        throw updateError;
      }
      
      // Call the callback to update avatar in parent component
      onAvatarUpdate(publicUrl);
      
      toast({
        description: t(
          "Profila attēls veiksmīgi atjaunināts",
          "Profile picture successfully updated",
          "Изображение профиля успешно обновлено"
        )
      });
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error", "Ошибка"),
        description: t(
          "Neizdevās augšupielādēt attēlu. Lūdzu, mēģiniet vēlreiz.",
          "Failed to upload image. Please try again.",
          "Не удалось загрузить изображение. Пожалуйста, попробуйте еще раз."
        )
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Special handling for demo user
  const handleDemoUserAvatar = async (file: File) => {
    try {
      // Convert file to data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result.toString();
          
          // Store in localStorage
          localStorage.setItem('demo_user_avatar', dataUrl);
          
          // Update avatar in state
          onAvatarUpdate(dataUrl);
          
          toast({
            description: t(
              "Profila attēls veiksmīgi atjaunināts",
              "Profile picture successfully updated",
              "Изображение профиля успешно обновлено"
            )
          });
          
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling demo user avatar:", error);
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error", "Ошибка"),
        description: t(
          "Neizdevās augšupielādēt attēlu. Lūdzu, mēģiniet vēlreiz.",
          "Failed to upload image. Please try again.",
          "Не удалось загрузить изображение. Пожалуйста, попробуйте еще раз."
        )
      });
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <UserAvatar user={user} size={size} />
      
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("Augšupielādē...", "Uploading...", "Загрузка...")}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {t("Augšupielādēt attēlu", "Upload Image", "Загрузить изображение")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
