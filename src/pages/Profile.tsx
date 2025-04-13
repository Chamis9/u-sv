
import React from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileContainer } from "@/components/profile/ProfileContainer";

const Profile = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <SEO 
          title="Profiles - netieku.es" 
          description="Pārvaldiet savu lietotāja profilu"
        />
        <Header />
        <ProfileContainer />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Profile;
