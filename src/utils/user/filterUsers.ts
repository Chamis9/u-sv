
import type { User } from '@/types/users';

export const filterUsers = (users: User[], searchTerm: string): User[] => {
  if (!searchTerm.trim()) {
    return users;
  }
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return users.filter(user => 
    user.email?.toLowerCase().includes(lowerSearchTerm) ||
    user.id.toLowerCase().includes(lowerSearchTerm) ||
    user.name?.toLowerCase().includes(lowerSearchTerm) ||
    user.phone?.toLowerCase().includes(lowerSearchTerm)
  );
};
