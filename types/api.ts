export interface ActionState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PasswordValidationResult {
  isValid: boolean;
  feedback: string[];
}
