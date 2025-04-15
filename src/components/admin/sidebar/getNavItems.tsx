
import React from 'react';
import { 
  Home, 
  Users, 
  Inbox, 
  Settings, 
  LogOut  // Adding LogOut icon from Lucide React
} from 'lucide-react';
import { TranslationObject } from '@/features/language/types';

export const getNavItems = (
  translations: TranslationObject, 
  userCount: number, 
  subscriberCount: number
) => {
  const items = [
    {
      id: 'dashboard',
      icon: <Home />,
      label: translations.admin?.dashboard || 'Dashboard',
      badge: 0
    },
    {
      id: 'users',
      icon: <Users />,
      label: translations.admin?.users || 'Users',
      badge: userCount
    },
    {
      id: 'subscribers',
      icon: <Inbox />,
      label: translations.admin?.subscribers || 'Subscribers',
      badge: subscriberCount
    },
    {
      id: 'settings',
      icon: <Settings />,
      label: translations.admin?.settings || 'Settings',
      badge: 0
    },
    {
      id: 'logout',
      icon: <LogOut />,
      label: translations.admin?.logout || 'Logout',
      badge: 0
    }
  ];

  return items;
};
