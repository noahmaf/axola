import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AxolaUser } from "../models/AxolaUser";
import authService from "@/app/services/authService";
import userService from "../services/userService";
import { User } from "@supabase/supabase-js";

const AuthContext = createContext<{
  user: AxolaUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => void;
  sendPasswordResetEmail: ({ email }: { email: string }) => Promise<void>;
  resetPassword: ({ password }: { password: string }) => Promise<void>;
  error: null;
}>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  resetPassword: async () => {},
  sendPasswordResetEmail: async () => {},
  refreshSession: async () => {},
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AxolaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        setUser(null);
        return;
      }

      const userProfile = await userService.getUserProfile({
        userId: currentUser?.id ?? "",
      });

      setUser(userProfile);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    let fetchedUser;
    try {
      fetchedUser = await authService.login({ email, password });

      if (!fetchedUser) setUser(null);

      if (fetchedUser) {
        await fetchProfile(fetchedUser!);
      }
    } catch (err: any) {
      throw err.message ?? "Something went wrong.";
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (fetchedUser: User) => {
    try {
      const userProfile = await userService.getUserProfile({
        userId: fetchedUser?.id ?? "",
      });

      setUser(userProfile);
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  const resetPassword = async ({ password }: { password: string }) => {
    try {
      setError(null);
      await authService.resetPassword({
        password: password,
      });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    }
  };

  const sendPasswordResetEmail = async ({ email }: { email: string }) => {
    try {
      setError(null);
      await authService.sendPasswordResetEmail({
        email: email,
        redirectTo: "http://localhost:5173/reset-password",
      });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshSession: fetchUser,
        resetPassword,
        sendPasswordResetEmail,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
