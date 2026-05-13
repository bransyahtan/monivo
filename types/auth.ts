import { RegisterInput, LoginInput } from "@/lib/validations/auth";

export type UserSession = {
  name: string;
  username: string;
  role: 'admin' | 'customer';
};

export type RegisterState = {
  success?: boolean;
  message?: string;
  user?: UserSession;
  errors?: {
    [K in keyof RegisterInput]?: string[];
  };
};

export type LoginState = {
  success?: boolean;
  message?: string;
  user?: UserSession;
  errors?: {
    [K in keyof LoginInput]?: string[];
  };
};
