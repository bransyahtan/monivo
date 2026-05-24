export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number: string | null;
  role: string;
  created_at: string | Date;
}
