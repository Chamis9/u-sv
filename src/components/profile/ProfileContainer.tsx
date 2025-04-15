
import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { User } from "@/types/users";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileAuthGuard } from "./ProfileAuthGuard";
import { ProfileMainContent } from "./components/ProfileMainContent";
import { useProfileData } from "./hooks/useProfileData";
import { useUserUpdates } from "./hooks/useUserUpdates";

interface ProfileContainerProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function ProfileContainer({ isAuthenticated, isLoading }: ProfileContainerProps) {
  const { user, setUser, isLoading: isDataLoading } = useProfileData();
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
    <ProfileAuthGuard isAuthenticated={isAuthenticated} isLoading={isLoading}>
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
                isLoading={isDataLoading}
              />
            } />
            <Route path="/tickets" element={
              <ProfileMainContent
                activeTab="tickets"
                user={user}
                onUserUpdate={updateUser}
                isLoading={isDataLoading}
              />
            } />
            <Route path="/payments" element={
              <ProfileMainContent
                activeTab="payments"
                user={user}
                onUserUpdate={updateUser}
                isLoading={isDataLoading}
              />
            } />
            <Route path="/settings" element={
              <ProfileMainContent
                activeTab="settings"
                user={user}
                onUserUpdate={updateUser}
                isLoading={isDataLoading}
              />
            } />
            <Route path="*" element={<Navigate to="/profile/account" replace />} />
          </Routes>
        </div>
      </div>
    </ProfileAuthGuard>
  );
}
