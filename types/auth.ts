import { LoginInput, RegisterInput } from "@/lib/validations/auth";
import type { ActionState } from "./api";
import { UserSession } from "./user";

export interface RegisterState extends ActionState {
  user?: UserSession;
  errors?: {
    [K in keyof RegisterInput]?: string[];
  };
}

export interface LoginState extends ActionState {
  user?: UserSession;
  errors?: {
    [K in keyof LoginInput]?: string[];
  };
}
