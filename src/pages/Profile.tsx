
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileContainer } from "@/components/profile/ProfileContainer";

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <SEO 
        title="Profiles - netieku.es" 
        description="Pārvaldiet savu lietotāja profilu"
      />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/profile/account" replace />} />
          <Route path="/*" element={<ProfileContainer />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
