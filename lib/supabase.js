import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sdgpsaqeyeatlzzohqfj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZ3BzYXFleWVhdGx6em9ocWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMDU0NTEsImV4cCI6MjA0NzY4MTQ1MX0.p4Vo7PTkmJP9jai0UrpfBrdvegqV0nszcP0QgoWRUOM";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
