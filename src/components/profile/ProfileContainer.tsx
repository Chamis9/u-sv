
import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  // Get the active tab from the current route
  const getActiveTabFromRoute = () => {
    const path = location.pathname.split('/')[2] || 'account';
    return path;
  };

  // Handle tab change by navigating to the appropriate route
  const handleTabChange = (tab: string) => {
    navigate(`/profile/${tab}`);
  };

  // Function to handle user updates
  const updateUser = async (updatedUser: User) => {
    if (!user) return;
    const result = await handleUserUpdate(user, updatedUser);
    setUser(result);
  };

  return (
    <ProfileAuthGuard isAuthenticated={isAuthenticated}>
      <div className="flex flex-1 overflow-hidden pt-16">
        <ProfileSidebar 
          activeTab={getActiveTabFromRoute()} 
          onTabChange={handleTabChange}
          user={user}
        />
        
        <div className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/profile/account" replace />} />
            <Route path="/account" element={
              <ProfileMainContent
                activeTab="account"
                user={user}
                onUserUpdate={updateUser}
                isLoading={isLoading}
              />
            } />
            <Route path="/tickets" element={
              <ProfileMainContent
                activeTab="tickets"
                user={user}
                onUserUpdate={updateUser}
                isLoading={isLoading}
              />
            } />
            <Route path="/payments" element={
              <ProfileMainContent
                activeTab="payments"
                user={user}
                onUserUpdate={updateUser}
                isLoading={isLoading}
              />
            } />
            <Route path="/settings" element={
              <ProfileMainContent
                activeTab="settings"
                user={user}
                onUserUpdate={updateUser}
                isLoading={isLoading}
              />
            } />
            <Route path="*" element={<Navigate to="/profile/account" replace />} />
          </Routes>
        </div>
      </div>
    </ProfileAuthGuard>
  );
}
