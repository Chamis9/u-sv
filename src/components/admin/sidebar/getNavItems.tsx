
import { LayoutDashboard, Users, Mail, Settings, Calendar } from "lucide-react";

export const getNavItems = (translations: any) => [
  {
    id: "dashboard",
    label: translations.admin?.tabs?.dashboard || "Dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    href: "/admin/dashboard"
  },
  {
    id: "users",
    label: translations.admin?.tabs?.users || "Users",
    icon: <Users className="mr-2 h-4 w-4" />,
    href: "/admin/users"
  },
  {
    id: "events",
    label: "Events",
    icon: <Calendar className="mr-2 h-4 w-4" />,
    href: "/admin/events"
  },
  {
    id: "subscribers",
    label: translations.admin?.tabs?.subscribers || "Subscribers",
    icon: <Mail className="mr-2 h-4 w-4" />,
    href: "/admin/subscribers"
  },
  {
    id: "settings",
    label: translations.admin?.tabs?.settings || "Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    href: "/admin/settings"
  }
];
