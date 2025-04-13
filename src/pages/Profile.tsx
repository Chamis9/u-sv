
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/users";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/language";
import { SEO } from "@/components/SEO";
import { updateUser } from "@/utils/user/userOperations";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminLoginSection } from "@/components/admin/AdminLoginSection";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { isAuthenticated, isAuthLoading, userEmail } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account"); // Default tab is account
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  useEffect(() => {
    // Only try to fetch user data if authenticated
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        if (isAuthenticated && userEmail) {
          // Real user fetching logic for authenticated users
          const { data, error } = await supabase
            .from('registered_users')
            .select('*')
            .eq('email', userEmail)
            .single();
            
          if (error) {
            console.error("Error fetching user data:", error);
            setUser(createMockUser()); // Fallback to mock data
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
              avatar_url: data.avatar_url
            });
          } else {
            // Fallback to mock user if no data found
            setUser(createMockUser());
          }
        } else {
          // No need to set mock user here, we'll show login screen instead
          setUser(null);
        }
      } catch (error) {
        console.error("Error in profile data fetch:", error);
        if (isAuthenticated) {
          setUser(createMockUser()); // Only set mock user for authenticated users
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, isAuthLoading, userEmail]);

  // Function to create a mock user for demonstration
  const createMockUser = (): User => {
    return {
      id: "mock-user-id-123",
      email: userEmail || "demo@example.com",
      name: "Demo Lietotājs",
      phone: "+371 12345678",
      created_at: new Date(2023, 0, 15).toISOString(),
      updated_at: new Date(2023, 5, 20).toISOString(),
      last_sign_in_at: new Date(2023, 11, 25).toISOString(),
      role: 'user',
      status: 'active',
      avatar_url: null
    };
  };
  
  // Function to handle user updates
  const handleUserUpdate = async (updatedUser: User) => {
    setUser(updatedUser);
    
    try {
      // Update user in database
      const { data, error } = await supabase
        .from('registered_users')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          avatar_url: updatedUser.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id);
        
      if (error) {
        throw error;
      }
      
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: t("Kļūda", "Error"),
        description: t(
          "Neizdevās atjaunināt lietotāja datus", 
          "Failed to update user data"
        )
      });
    }
  };

  // If the user is not authenticated, show the admin login
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <SEO 
            title={t("Lietotāja profils - netieku.es", "User Profile - netieku.es")} 
            description={t("Piekļūstiet savam lietotāja profilam", "Access your user profile")}
          />
          <Header />
          
          <AdminLoginSection onLoginClick={() => setShowLoginModal(true)} />
          <AdminLogin 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
            onLoginSuccess={() => setShowLoginModal(false)} 
          />
          
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <SEO 
          title={t("Mans profils - netieku.es", "My Profile - netieku.es")} 
          description={t("Pārvaldiet savu lietotāja profilu", "Manage your user profile")}
        />
        <Header />
        
        <div className="flex flex-1 overflow-hidden pt-16">
          {/* Sidebar - līdzīgi kā AdminSidebar */}
          <ProfileSidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            user={user}
          />
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6">
            <ProfileHeader activeTab={activeTab} user={user} />
            
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : user ? (
              <ProfileContent 
                activeTab={activeTab} 
                user={user} 
                onUserUpdate={handleUserUpdate}
                isLoading={isLoading}
              />
            ) : (
              <div className="text-center p-12 bg-slate-50 rounded-lg">
                <p className="text-lg text-muted-foreground">
                  {t("Lietotāja dati nav pieejami", "User data is not available")}
                </p>
              </div>
            )}
          </main>
        </div>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Profile;
