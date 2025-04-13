
import React, { useState } from "react";
import { AdminLoginSection } from "@/components/admin/AdminLoginSection";
import { AdminLogin } from "@/components/admin/AdminLogin";

interface ProfileAuthGuardProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export function ProfileAuthGuard({ children, isAuthenticated }: ProfileAuthGuardProps) {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  if (!isAuthenticated) {
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

  return <>{children}</>;
}
