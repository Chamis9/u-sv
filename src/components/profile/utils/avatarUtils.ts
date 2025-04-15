import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/users";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadOptions {
  file: File;
  user: User;
  toast: ReturnType<typeof useToast>["toast"];
  t: (lvText: string, enText: string, ruText?: string) => string;
}

export async function uploadAvatarToSupabase({ file, user, toast, t }: AvatarUploadOptions) {
  try {
    // Create a unique file path using user ID and timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    console.log("Preparing to upload avatar to path:", filePath);
    
    // Upload the file to Supabase Storage
    console.log("Uploading file to Supabase storage...");
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
    
    console.log("File uploaded successfully, data:", data);
    
    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData?.publicUrl;
    
    if (!publicUrl) {
      console.error("Failed to generate public URL");
      throw new Error("Failed to generate public URL for uploaded avatar");
    }
    
    console.log("Generated public URL:", publicUrl);
    
    // Update the user's avatar URL in the database
    const { error: updateError } = await supabase
      .from('registered_users')
      .update({ 
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }
    
    toast({
      description: t(
        "Profila attēls veiksmīgi atjaunināts",
        "Profile picture successfully updated",
        "Изображение профиля успешно обновлено"
      )
    });
    
    return publicUrl;
    
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
    return null;
  }
}

export async function handleDemoUserAvatar(file: File, onAvatarUpdate: (url: string) => void, toast: ReturnType<typeof useToast>["toast"], t: (lvText: string, enText: string, ruText?: string) => string) {
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
      }
    };
    reader.readAsDataURL(file);
    return true;
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
    return false;
  }
}

export function validateAvatarFile(file: File, toast: ReturnType<typeof useToast>["toast"], t: (lvText: string, enText: string, ruText?: string) => string): boolean {
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
    return false;
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
    return false;
  }
  
  return true;
}
