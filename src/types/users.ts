
export interface User {
  id: string;
  email: string | null;
  name?: string | null;
  phone?: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string | null;
  role?: string;
  status?: 'active' | 'inactive';
}
