
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { AdminLoginSection } from "@/components/admin/AdminLoginSection";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function AdminPage() {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAuthenticated, isAuthLoading } = useAuth();

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
      <>
        <AdminLoginSection onLoginClick={() => setShowLoginModal(true)} />
        <AdminLogin 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Administrator Panel - netieku.es</title>
        <meta name="description" content="Administrator panel for platform management" />
      </Helmet>

      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden pt-16"> {/* Added pt-16 to create space below header */}
        {/* Sidebar */}
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          subscriberCount={5}
        />
        
        {/* Main content */}
        <AdminContent activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <Footer />
    </div>
  );
}

// Wrap the AdminPage with the AuthProvider to provide authentication context
export default function Admin() {
  return (
    <AuthProvider>
      <AdminPage />
    </AuthProvider>
  );
}
