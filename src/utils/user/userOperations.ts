
import type { User } from '@/types/users';
import { updateUserBase, deleteUserBase } from '../operations/baseOperations';

export async function updateUser(user: User) {
  return updateUserBase(user, 'registered_users', {
    name: user.name,
    phone: user.phone,
    status: user.status
  });
}

export async function deleteUser(userId: string) {
  return deleteUserBase(userId, 'registered_users');
}

export async function toggleUserStatus(user: User) {
  const newStatus = user.status === 'active' ? 'inactive' : 'active';
  
  return updateUserBase(user, 'registered_users', {
    status: newStatus
  });
}
