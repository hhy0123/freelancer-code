import { createClient } from "@supabase/supabase-js";

// service role 키는 서버에서만 쓴다. 접근 제어는 URL 토큰으로 한다.
// ponytail: RLS 대신 토큰 게이트. 실서비스면 auth + RLS로.
export const db = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);
