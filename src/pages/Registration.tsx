
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/features/language";
import { LoginButton } from "@/components/auth/LoginButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Registration = () => {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  // If user is already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('Reģistrācija - netieku.es', 'Registration - netieku.es')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">
            {t('Reģistrācija', 'Registration')}
          </h1>
          
          <p className="mb-8 text-muted-foreground">
            {t(
              'Izveidojiet kontu, lai piekļūtu visām platformas iespējām',
              'Create an account to access all platform features'
            )}
          </p>
          
          <LoginButton 
            defaultTab="register"
            className="w-full"
          >
            {t('Reģistrēties', 'Register')}
          </LoginButton>
        </div>
      </div>
    </div>
  );
};

export default Registration;
