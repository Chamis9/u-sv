
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLoginSection } from "@/components/admin/AdminLoginSection";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminSubscribers } from "@/components/admin/AdminSubscribers";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminEventsList } from "@/components/admin/AdminEventsList";
import { AdminCategoriesList } from "@/components/admin/categories/AdminCategoriesList";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAuthGuard } from "@/components/profile/ProfileAuthGuard";

function AdminPage() {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [adminCount, setAdminCount] = useState(0);
  const { isAuthenticated, isAuthLoading, isAdmin, checkAdminStatus } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check admin status when component mounts and when auth state changes
  useEffect(() => {
    const verifyAdminAccess = async () => {
      console.log("Verifying admin access, auth status:", isAuthenticated);
      
      if (isAuthenticated) {
        const hasAdminAccess = await checkAdminStatus();
        console.log("Admin access check result:", hasAdminAccess);
        
        if (!hasAdminAccess) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You do not have administrator privileges",
          });
          window.location.href = 'https://netieku.es/';
        }
      }
    };
    
    if (!isAuthLoading) {
      verifyAdminAccess();
    }
  }, [isAuthenticated, isAuthLoading, checkAdminStatus, navigate, toast]);

  // Listen for updates to admin count
  useEffect(() => {
    const handleAdminCountUpdate = (event: CustomEvent<{count: number}>) => {
      if (event.detail && typeof event.detail.count === 'number') {
        setAdminCount(event.detail.count);
      }
    };

    // Type assertion for the event listener
    window.addEventListener('adminCountUpdated', handleAdminCountUpdate as EventListener);
    
    return () => {
      window.removeEventListener('adminCountUpdated', handleAdminCountUpdate as EventListener);
    };
  }, []);

  const getActiveTabFromRoute = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path;
  };

  const handleTabChange = (tab: string) => {
    navigate(`/${tab}`);
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProfileAuthGuard 
      isAuthenticated={isAuthenticated}
      isLoading={isAuthLoading}
      requireAdmin={true}
      isAdmin={isAdmin}
    >
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Helmet>
          <title>Administrator Panel - netieku.es</title>
          <meta name="description" content="Administrator panel for platform management" />
        </Helmet>

        <AdminHeader />
        
        <div className="flex flex-1 overflow-hidden pt-16">
          <AdminSidebar 
            activeTab={getActiveTabFromRoute()} 
            onTabChange={handleTabChange}
          />
          
          <div className="flex-1 overflow-auto p-8">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/events" element={<AdminEventsList />} />
              <Route path="/categories" element={<AdminCategoriesList />} />
              <Route path="/subscribers" element={<AdminSubscribers />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
        
        <Footer />
      </div>
    </ProfileAuthGuard>
  );
}

export default function Admin() {
  const [showLogin, setShowLogin] = useState(false);
  
  return (
    <AuthProvider>
      <React.Fragment>
        <AdminPage />
        <AdminLogin 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={() => setShowLogin(false)} 
        />
      </React.Fragment>
    </AuthProvider>
  );
}
