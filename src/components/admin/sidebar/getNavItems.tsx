
import { LayoutDashboard, Users, Mail, Settings, FolderPlus, Shield, Ticket } from "lucide-react";

export const getNavItems = (translations: any, userCount?: number, subscriberCount?: number, adminCount?: number) => [
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
    href: "/admin/users",
    badge: userCount
  },
  {
    id: "categories",
    label: "Kategorijas",
    icon: <FolderPlus className="mr-2 h-4 w-4" />,
    href: "/admin/categories"
  },
  {
    id: "tickets",
    label: "Biļetes",
    icon: <Ticket className="mr-2 h-4 w-4" />,
    href: "/admin/tickets"
  },
  {
    id: "subscribers",
    label: translations.admin?.tabs?.subscribers || "Subscribers",
    icon: <Mail className="mr-2 h-4 w-4" />,
    href: "/admin/subscribers",
    badge: subscriberCount
  },
  {
    id: "settings",
    label: translations.admin?.tabs?.settings || "Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    href: "/admin/settings"
  }
];
