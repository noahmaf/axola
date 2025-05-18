import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/app/context/authContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useSessionExpiryWatcher() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const checkExpiry = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data.session;

      if (!session || error) return;

      const expiresAt = session.expires_at!;
      const now = Math.floor(Date.now() / 1000);
      const msUntilExpiry = (expiresAt - now) * 1000;

      if (msUntilExpiry > 0) {
        timeout = setTimeout(async () => {
          await logout();
          navigate("/");
        }, msUntilExpiry);
      } else {
        await logout();
        navigate("/");
      }
    };

    checkExpiry();

    return () => clearTimeout(timeout);
  }, [navigate]);
}
