
import type { User } from '@/types/users';
import { updateUserBase, deleteUserBase } from '../operations/baseOperations';

export async function updateUser(user: User) {
  return updateUserBase(user, 'admin_user', {
    email: user.email
  });
}

export async function deleteUser(userId: string) {
  return deleteUserBase(userId, 'admin_user');
}
