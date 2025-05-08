
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/forms/LoginForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
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
        <title>{t('Pieslēgties - netieku.es', 'Login - netieku.es')}</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-6">
              {t('Pieslēgties', 'Login')}
            </h1>
            
            <p className="mb-8 text-muted-foreground">
              {t(
                'Pieslēdzieties savam kontam',
                'Log in to your account'
              )}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <LoginForm onClose={() => {}} />
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {t('Nav konta?', 'Don\'t have an account?')}{' '}
                <Button variant="link" asChild className="p-0">
                  <Link to="/registration">
                    {t('Reģistrēties', 'Register')}
                  </Link>
                </Button>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
