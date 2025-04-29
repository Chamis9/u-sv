
import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { isAuthenticated, isAuthLoading, user } = useAuth();
  const navigate = useNavigate();

  // If loading, show nothing (prevent flash)
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <SEO 
        title="Mans Profils - netieku.es" 
        description="Pārvaldiet savu lietotāja profilu"
      />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to={`/profile/${user.id}/account`} replace />} />
          <Route path="/:userId/*" element={
            <ProfileContainer 
              isAuthenticated={isAuthenticated}
              isLoading={isAuthLoading}
              userId={user.id}
            />
          } />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
