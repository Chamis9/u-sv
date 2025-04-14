
import React from "react";
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
      <ProfileContainer />
      <Footer />
    </div>
  );
};

export default Profile;
