
import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { User } from "@/types/users";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileAuthGuard } from "./ProfileAuthGuard";
import { ProfileMainContent } from "./components/ProfileMainContent";
import { useProfileData } from "./hooks/useProfileData";
import { useUserUpdates } from "./hooks/useUserUpdates";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/features/language";

interface ProfileContainerProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string;
}

export function ProfileContainer({ isAuthenticated, isLoading, userId }: ProfileContainerProps) {
  const { userId: routeUserId } = useParams();
  const { user: authUser } = useAuth();
  const { user, setUser, isLoading: isDataLoading } = useProfileData();
  const { handleUserUpdate } = useUserUpdates();
  const { currentLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is trying to access their own profile
  React.useEffect(() => {
    if (routeUserId && authUser && routeUserId !== authUser.id) {
      navigate(`/${currentLanguage.code}/profile/${authUser.id}/account`, { replace: true });
    }
  }, [routeUserId, authUser, navigate, currentLanguage.code]);

  // Get the active tab from the current route - fix the parsing logic
  const getActiveTabFromRoute = () => {
    // URL structure: /lang/profile/userId/tab
    // Split by '/' and get the last segment which should be the tab
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    
    // For profile routes, the structure should be: [lang, 'profile', userId, tab]
    // So the tab should be at index 3
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // If the last segment is a valid tab name, use it, otherwise default to 'account'
    const validTabs = ['account', 'tickets', 'payments', 'settings'];
    if (validTabs.includes(lastSegment)) {
      return lastSegment;
    }
    
    return 'account';
  };

  // Handle tab change by navigating to the appropriate route
  const handleTabChange = (tab: string) => {
    navigate(`/${currentLanguage.code}/profile/${userId}/${tab}`);
  };

  // Function to handle user updates
  const updateUser = async (updatedUser: User) => {
    if (!user) return;
    const result = await handleUserUpdate(user, updatedUser);
    setUser(result);
  };

  const activeTab = getActiveTabFromRoute();
  console.log("Current route:", location.pathname);
  console.log("Active tab:", activeTab);
  console.log("Current language:", currentLanguage.code);

  return (
    <ProfileAuthGuard isAuthenticated={isAuthenticated} isLoading={isLoading}>
      <div className="flex flex-1 overflow-hidden pt-16">
        <ProfileSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          user={user}
        />
        
        <div className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to={`/${currentLanguage.code}/profile/${userId}/account`} replace />} />
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
            <Route path="*" element={<Navigate to={`/${currentLanguage.code}/profile/${userId}/account`} replace />} />
          </Routes>
        </div>
      </div>
    </ProfileAuthGuard>
  );
}
