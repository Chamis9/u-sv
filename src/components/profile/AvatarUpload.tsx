import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";

export function AvatarUpload() {
  const { user, setUser, refreshUserData } = useAuth();
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const fileName = file.name;

    try {
      setUploading(true);
  
      // Upload image to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error('Failed to get public URL for avatar');
      }

      // Update user profile with new avatar URL using RPC function
      const { error: updateError } = await supabase.rpc('update_user_avatar', { 
        user_id: user.id,
        new_avatar_url: publicUrl
      });

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setUser({ ...user, avatar_url: publicUrl });
      
      toast({
        description: t("Avatārs veiksmīgi atjaunots", "Avatar successfully updated")
      });
      
      // Refresh user data in auth context if needed
      if (refreshUserData) {
        refreshUserData();
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error"),
        description: t("Neizdevās augšupielādēt avatāru", "Failed to upload avatar")
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user?.avatar_url} alt={user?.first_name || "Avatar"} />
        <AvatarFallback>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <Label htmlFor="avatar">
          {t("Augšupielādēt jaunu avatāru", "Upload new avatar")}
        </Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full"
        />
      </div>
    </div>
  );
}
