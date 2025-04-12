
import React, { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/features/language";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(true); // Temporarily set to true for development
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { translations } = useLanguage();

  // Actually, in a real app we would check if the user is authenticated and has admin role
  // const [isAdmin, setIsAdmin] = useState(false);
  // useEffect(() => {
  //   const checkAdminStatus = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (session?.user) {
  //       // Check if user has admin role
  //       const { data, error } = await supabase
  //         .from('user_roles')
  //         .select('*')
  //         .eq('user_id', session.user.id)
  //         .eq('role', 'admin')
  //         .single();
  //       
  //       setIsAdmin(!!data && !error);
  //     }
  //   };
  //   
  //   checkAdminStatus();
  // }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        description: "Jūs esat veiksmīgi izrakstījies",
      });
      // Use window.logout which is defined in App.tsx
      if (window.logout) {
        window.logout();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Neizdevās izrakstīties. Lūdzu, mēģiniet vēlreiz.",
      });
    }
  };

  if (!isAdmin) {
    toast({
      variant: "destructive",
      description: "Jums nav piekļuves administratora panelim",
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Administratora panelis - netieku.es</title>
        <meta name="description" content="Administratora panelis platformas pārvaldībai" />
      </Helmet>

      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden pt-16"> {/* Added pt-16 to create space below header */}
        {/* Sānu josla */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Administratora panelis</h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-4 w-4" /> Pārskats
            </Button>
            
            <Button 
              variant={activeTab === "users" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" /> Lietotāji
              <Badge className="ml-auto" variant="outline">23</Badge>
            </Button>
            
            <Button 
              variant={activeTab === "subscribers" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("subscribers")}
            >
              <Mail className="mr-2 h-4 w-4" /> Abonenti
              <Badge className="ml-auto" variant="outline">5</Badge>
            </Button>
            
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" /> Iestatījumi
            </Button>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Izrakstīties
            </Button>
          </div>
        </aside>
        
        {/* Galvenais saturs */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="container mx-auto">
            {/* Mobilais skats - tabs */}
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
            
            {/* Dinamiskais saturs */}
            {activeTab === "dashboard" && <AdminDashboard />}
            {activeTab === "users" && <AdminUsers />}
            {activeTab === "subscribers" && <AdminSubscribers />}
            {activeTab === "settings" && <AdminSettings />}
            
            {/* Navigācija atpakaļ uz mājas lapu */}
            <div className="mt-8 flex justify-end">
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" /> Atgriezties uz mājas lapu
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
