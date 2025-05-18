export interface LoginRequest {
  email: string;
  password: string;
}

export interface SendPasswordResetEmail {
  email: string;
  redirectTo: string;
}

export interface ResetPasswordRequest {
  password: string;
}
