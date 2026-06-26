import { createSupabaseServerClient } from '@/lib/supabase/server';

// Returns the logged-in admin user, or null. Used to guard server components
// and API route handlers (which the /admin middleware matcher does not cover).
export async function getSessionUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
