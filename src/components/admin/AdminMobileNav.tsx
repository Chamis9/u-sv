
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, Mail, Settings } from "lucide-react";

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminMobileNav({ activeTab, onTabChange }: AdminMobileNavProps) {
  return (
    <div className="md:hidden mb-6">
      <Tabs value={activeTab} onValueChange={onTabChange}>
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
  );
}
