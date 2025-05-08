
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "@/components/registration/RegistrationForm";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Helmet>
        <title>{t('Reģistrācija - netieku.es', 'Registration - netieku.es')}</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-6">
            {t('Reģistrācija', 'Registration')}
          </h1>
          
          <p className="mb-8 text-muted-foreground">
            {t(
              'Izveidojiet kontu, lai piekļūtu visām platformas iespējām',
              'Create an account to access all platform features'
            )}
          </p>
        </div>
        
        <RegistrationForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Registration;
