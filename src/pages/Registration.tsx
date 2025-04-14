
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import RegistrationForm from "@/components/registration/RegistrationForm";

const Registration = () => {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Only allow access if authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('Reģistrācija - netieku.es', 'Registration - netieku.es')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {t('Reģistrācija', 'Registration')}
        </h1>
        
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Registration;
