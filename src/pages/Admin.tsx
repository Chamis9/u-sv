
import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Settings, Database, Ticket, Mail, 
  Bell, Shield, LogOut, Home 
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminSubscribers } from "@/components/admin/AdminSubscribers";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/features/language";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { translations, currentLanguage } = useLanguage();

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuthStatus = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth status check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuthStatus();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    // Initialize admin account if it doesn't exist
    const createAdminAccount = async () => {
      // Check if admin exists
      const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail('admin@netieku.es');
      
      if (checkError || !existingUser) {
        // Create admin user if doesn't exist
        const { data, error } = await supabase.auth.admin.createUser({
          email: 'admin@netieku.es',
          password: 'raivis2025!',
          email_confirm: true,
        });
        
        if (error) {
          console.error('Error creating admin account:', error);
        } else {
          console.log('Admin account created successfully');
        }
      }
    };
    
    // In a real app, this would be done through a secure setup process, not client-side
    // createAdminAccount();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        description: currentLanguage.code === 'lv' 
          ? "Jūs esat veiksmīgi izrakstījies" 
          : "You have successfully logged out",
      });
      
      // Use window.logout which is defined in App.tsx
      if (window.logout) {
        window.logout();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: currentLanguage.code === 'lv'
          ? "Neizdevās izrakstīties. Lūdzu, mēģiniet vēlreiz."
          : "Failed to log out. Please try again.",
      });
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAuthenticated(true);
  };

  // Translation helper function
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show login modal if not authenticated
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Helmet>
          <title>{t('Administratora panelis - netieku.es', 'Administrator Panel - netieku.es')}</title>
        </Helmet>
        
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md text-center space-y-6">
            <h1 className="text-3xl font-bold">{t('Administratora panelis', 'Administrator Panel')}</h1>
            <p className="text-muted-foreground">
              {t('Lai piekļūtu administratora panelim, jums ir jāpierakstās.', 'To access the administrator panel, you need to log in.')}
            </p>
            <Button onClick={() => setShowLoginModal(true)} className="w-full">
              {t('Pieslēgties', 'Login')}
            </Button>
            <div className="pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  {t('Atgriezties uz mājas lapu', 'Return to Home Page')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <AdminLogin 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('Administratora panelis - netieku.es', 'Administrator Panel - netieku.es')}</title>
        <meta name="description" content={t('Administratora panelis platformas pārvaldībai', 'Administrator panel for platform management')} />
      </Helmet>

      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden pt-16"> {/* Added pt-16 to create space below header */}
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">{t('Administratora panelis', 'Administrator Panel')}</h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-4 w-4" /> {t('Pārskats', 'Dashboard')}
            </Button>
            
            <Button 
              variant={activeTab === "users" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" /> {t('Lietotāji', 'Users')}
              <Badge className="ml-auto" variant="outline">23</Badge>
            </Button>
            
            <Button 
              variant={activeTab === "subscribers" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("subscribers")}
            >
              <Mail className="mr-2 h-4 w-4" /> {t('Abonenti', 'Subscribers')}
              <Badge className="ml-auto" variant="outline">5</Badge>
            </Button>
            
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" /> {t('Iestatījumi', 'Settings')}
            </Button>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> {t('Izrakstīties', 'Logout')}
            </Button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="container mx-auto">
            {/* Mobile view - tabs */}
            <div className="md:hidden mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="dashboard">
                    <Home className="h-5 w-5" />
                  </TabsTrigger>
                  <TabsTrigger value="users">
                    <Users className="h-5 w-5" />
                  </TabsTrigger>
                  <TabsTrigger value="subscribers">
                    <Mail className="h-5 w-5" />
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-5 w-5" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Dynamic content */}
            {activeTab === "dashboard" && <AdminDashboard />}
            {activeTab === "users" && <AdminUsers />}
            {activeTab === "subscribers" && <AdminSubscribers />}
            {activeTab === "settings" && <AdminSettings />}
            
            {/* Navigation back to home page */}
            <div className="mt-8 flex justify-end">
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" /> {t('Atgriezties uz mājas lapu', 'Return to Home Page')}
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
