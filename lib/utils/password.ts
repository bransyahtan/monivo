export interface PasswordValidationResult {
  isValid: boolean;
  feedback: string[];
}

interface ValidationRule {
  test: (pw: string) => boolean;
  message: string;
}

const RULES: ValidationRule[] = [
  {
    test: (pw) => pw.length >= 8,
    message: "Password must be at least 8 characters long",
  },
  {
    test: (pw) => /[A-Z]/.test(pw),
    message: "Password must contain at least one uppercase letter",
  },
  {
    test: (pw) => /[a-z]/.test(pw),
    message: "Password must contain at least one lowercase letter",
  },
  {
    test: (pw) => /[0-9]/.test(pw),
    message: "Password must contain at least one number",
  },
  {
    test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    message: "Password must contain at least one special character",
  },
];

export function validatePasswordStrength(
  password: string,
): PasswordValidationResult {
  const feedback = RULES.filter((rule) => !rule.test(password)).map(
    (rule) => rule.message,
  );

  return {
    isValid: feedback.length === 0,
    feedback,
  };
}
