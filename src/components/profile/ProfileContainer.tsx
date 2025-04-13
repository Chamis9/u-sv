
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/users";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileAuthGuard } from "./components/ProfileAuthGuard";
import { ProfileMainContent } from "./components/ProfileMainContent";
import { useProfileData } from "./hooks/useProfileData";
import { useUserUpdates } from "./hooks/useUserUpdates";

export function ProfileContainer() {
  const { isAuthenticated } = useAuth();
  const { user, setUser, isLoading } = useProfileData();
  const { handleUserUpdate } = useUserUpdates();
  const [activeTab, setActiveTab] = useState("account"); // Default tab is account

  // Function to handle user updates
  const updateUser = async (updatedUser: User) => {
    if (!user) return;
    
    const result = await handleUserUpdate(user, updatedUser);
    setUser(result);
  };

  return (
    <ProfileAuthGuard isAuthenticated={isAuthenticated}>
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <ProfileSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          user={user}
        />
        
        {/* Main content */}
        <ProfileMainContent
          activeTab={activeTab}
          user={user}
          onUserUpdate={updateUser}
          isLoading={isLoading}
        />
      </div>
    </ProfileAuthGuard>
  );
}
