export type UserRole = "admin" | "customer";

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number: string | null;
  role: UserRole;
  created_at: string | Date;
}

export interface AdminUser extends UserProfile {
  is_active: boolean;
}

export interface UserCreateData {
  name: string;
  username: string;
  email: string;
  hashedPassword: string;
  phone_number?: string | null;
}

export interface UserSession {
  userId: number;
  name: string;
  username: string;
  role: UserRole;
}
