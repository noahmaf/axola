import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_AXOLA_SUPABASE_URL || "";
const serviceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient(supabaseUrl, serviceRole);
