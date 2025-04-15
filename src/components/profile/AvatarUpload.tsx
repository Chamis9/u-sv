
import React, { useState, useRef } from "react";
import { User } from "@/types/users";
import { UserAvatar } from "./UserAvatar";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "./UploadButton";
import { 
  validateAvatarFile, 
  uploadAvatarToSupabase, 
  handleDemoUserAvatar 
} from "./utils/avatarUtils";
import { useProfileTranslation } from "./utils/i18n";

interface AvatarUploadProps {
  user: User;
  onAvatarUpdate: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({ user, onAvatarUpdate, size = "lg" }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useProfileTranslation();
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate the file
    if (!validateAvatarFile(file, toast, t)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log("Processing avatar upload for user:", user.id);
      
      // Special handling for demo user - store avatar in localStorage instead
      if (user.id.startsWith('mock-user-id')) {
        await handleDemoUserAvatar(file, onAvatarUpdate, toast, t);
      } else {
        // Regular user - upload to Supabase
        const publicUrl = await uploadAvatarToSupabase({
          file,
          user,
          toast,
          t
        });
        
        if (publicUrl) {
          console.log("Avatar upload successful, updating UI with new URL");
          // Call the callback to update avatar in parent component
          onAvatarUpdate(publicUrl);
        } else {
          console.error("Avatar upload failed - no URL returned");
        }
      }
    } catch (err) {
      console.error("Error in avatar upload process:", err);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        
        <UploadButton
          isUploading={isUploading}
          onClick={handleUploadClick}
          label={t("Augšupielādēt attēlu", "Upload Image", "Загрузить изображение")}
          loadingLabel={t("Augšupielādē...", "Uploading...", "Загрузка...")}
        />
      </div>
    </div>
  );
}
