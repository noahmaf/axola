import { supabase } from "@/api/supabaseClient";
import {
  LoginRequest,
  ResetPasswordRequest,
  SendPasswordResetEmail,
} from "../models/Auth";

const authService = {
  async login(request: LoginRequest) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: request.email,
      password: request.password,
    });

    if (error) throw error;

    return data.user;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.user ?? null;
  },

  async sendPasswordResetEmail(request: SendPasswordResetEmail) {
    const { error } = await supabase.auth.resetPasswordForEmail(request.email, {
      redirectTo: request.redirectTo,
    });
    if (error) throw error;
    return "Password reset email sent";
  },

  async resetPassword(request: ResetPasswordRequest) {
    const { error } = await supabase.auth.updateUser({
      password: request.password,
    });
    if (error) throw error;
    return "Password successfully reset";
  },
};

export default authService;
