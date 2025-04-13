
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/users";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/language";
import { SEO } from "@/components/SEO";
import { updateUser } from "@/utils/user/userOperations";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { isAuthenticated, isAuthLoading, userEmail } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      if (!userEmail) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user data from registered_users table
        const { data, error } = await supabase
          .from('registered_users')
          .select('*')
          .eq('email', userEmail)
          .single();
          
        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }
        
        if (data) {
          setUser({
            id: data.id,
            email: data.email,
            name: data.name,
            phone: data.phone,
            created_at: data.created_at,
            updated_at: data.updated_at,
            last_sign_in_at: data.last_sign_in_at,
            role: 'user',
            status: data.status as 'active' | 'inactive',
            avatar_url: null
          });
        }
      } catch (error) {
        console.error("Error in profile data fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [isAuthenticated, isAuthLoading, userEmail, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const result = await updateUser(updatedUser);
      
      if (result.success) {
        setUser(updatedUser);
        setIsEditing(false);
        return true;
      } else {
        console.error("Failed to update user:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={t("Mans profils - netieku.es", "My Profile - netieku.es")} 
        description={t("Pārvaldiet savu lietotāja profilu", "Manage your user profile")}
      />
      <Header />
      
      <main className="flex-grow pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">{t("Mans profils", "My Profile")}</h1>
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : user ? (
            isEditing ? (
              <ProfileEditForm 
                user={user} 
                onCancel={handleCancel}
                onSave={handleSave}
              />
            ) : (
              <ProfileInfo user={user} onEdit={handleEdit} />
            )
          ) : (
            <div className="text-center p-12 bg-slate-50 rounded-lg">
              <p className="text-lg text-muted-foreground">
                {t("Lietotāja dati nav pieejami", "User data is not available")}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
