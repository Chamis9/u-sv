
import { LayoutDashboard, Users, Mail, Settings, Calendar } from "lucide-react";

export const getNavItems = (translations: any) => [
  {
    title: translations.admin?.tabs?.dashboard || "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard"
  },
  {
    title: translations.admin?.tabs?.users || "Users",
    icon: Users,
    href: "/admin/users"
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/admin/events"
  },
  {
    title: translations.admin?.tabs?.subscribers || "Subscribers",
    icon: Mail,
    href: "/admin/subscribers"
  },
  {
    title: translations.admin?.tabs?.settings || "Settings",
    icon: Settings,
    href: "/admin/settings"
  }
];
