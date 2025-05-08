
import React, { useState, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/users";
import { UserAvatar } from "./UserAvatar";
import { UploadButton } from "./UploadButton";

interface AvatarUploadProps {
  user: User;
  onAvatarUpdate: () => void;
}

export function AvatarUpload({ user, onAvatarUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const uploadAvatar = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error(t('Nav izvēlēts fails', 'No file selected'));
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const folderPath = `${user.id}`;
      const fileName = `${folderPath}/${user.id}.${fileExt}`;
      
      // First, list existing files to delete them
      const { data: existingFiles } = await supabase.storage
        .from('avatars')
        .list(folderPath);
      
      // Delete all existing files in the user's folder
      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map(file => `${folderPath}/${file.name}`);
        await supabase.storage
          .from('avatars')
          .remove(filesToRemove);
      }
      
      // Upload the new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Use direct RPC call instead of querying registered_users
      const { error: updateError } = await supabase.rpc(
        'update_user_avatar', 
        { 
          user_id: user.id, 
          new_avatar_url: publicUrl
        }
      );

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate();
      
      toast({
        description: t(
          'Profila attēls veiksmīgi atjaunināts',
          'Profile picture successfully updated'
        ),
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t(
          'Neizdevās augšupielādēt profila attēlu',
          'Failed to upload profile picture'
        ),
      });
    } finally {
      setIsUploading(false);
    }
  }, [user.id, onAvatarUpdate, toast, t]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <UserAvatar user={user} size="lg" forceRefresh />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        className="hidden"
        disabled={isUploading}
      />
      
      <UploadButton
        isUploading={isUploading}
        onClick={handleButtonClick}
        label={t('Mainīt profila attēlu', 'Change profile picture')}
        loadingLabel={t('Augšupielādē...', 'Uploading...')}
      />
    </div>
  );
}
