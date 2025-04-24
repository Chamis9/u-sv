
import React from 'react';
import { 
  Home, 
  Users, 
  Inbox, 
  Settings, 
  LogOut
} from 'lucide-react';
import { TranslationObject } from '@/features/language/types';

export const getNavItems = (
  translations: TranslationObject, 
  userCount: number, 
  subscriberCount: number
) => {
  // Extract admin translations safely
  const adminTranslations = translations.admin as TranslationObject | undefined;
  const tabs = adminTranslations?.tabs as TranslationObject | undefined;
  const logout = adminTranslations?.logout as string || 'Logout';

  const items = [
    {
      id: 'dashboard',
      icon: <Home />,
      label: tabs?.dashboard as string || 'Dashboard',
      badge: undefined  // Remove badge for dashboard
    },
    {
      id: 'users',
      icon: <Users />,
      label: tabs?.users as string || 'Users',
      badge: userCount
    },
    {
      id: 'subscribers',
      icon: <Inbox />,
      label: tabs?.subscribers as string || 'Subscribers',
      badge: subscriberCount
    },
    {
      id: 'settings',
      icon: <Settings />,
      label: tabs?.settings as string || 'Settings',
      badge: undefined  // Remove badge for settings
    },
    {
      id: 'logout',
      icon: <LogOut />,
      label: logout,
      badge: undefined  // Remove the badge for logout
    }
  ];

  return items;
};
