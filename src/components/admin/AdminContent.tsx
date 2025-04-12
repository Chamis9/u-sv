
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguage } from "@/features/language";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminSubscribers } from "@/components/admin/AdminSubscribers";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

interface AdminContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminContent({ activeTab, onTabChange }: AdminContentProps) {
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="container mx-auto">
        {/* Mobile view - tabs */}
        <AdminMobileNav activeTab={activeTab} onTabChange={onTabChange} />
        
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
  );
}
