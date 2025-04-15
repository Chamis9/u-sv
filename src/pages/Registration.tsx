
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { ProfileAuthGuard } from "@/components/profile/components/ProfileAuthGuard";

const Registration = () => {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('Reģistrācija - netieku.es', 'Registration - netieku.es')}</title>
      </Helmet>
      
      <ProfileAuthGuard isAuthenticated={isAuthenticated}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            {t('Reģistrācija', 'Registration')}
          </h1>
          
          <RegistrationForm />
        </div>
      </ProfileAuthGuard>
    </div>
  );
};

export default Registration;

