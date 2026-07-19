/**
 * Raw Supabase admin client — uses service role key, bypasses RLS.
 * Uses the untyped client to avoid TypeScript inference issues on insert/update.
 * ONLY use server-side. Never expose to the browser.
 */
import { createClient } from '@supabase/supabase-js'

export function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
