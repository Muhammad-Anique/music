// utils/supabaseServer.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { parse, serialize } from 'cookie';

export const createServerSupabaseClient = (headers: Headers, rawCookies: string) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookies = parse(rawCookies ?? '');
          return cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          const newCookie = serialize(name, value, options);
          headers.append('Set-Cookie', newCookie);
        },
        remove(name: string, options: CookieOptions) {
          const newCookie = serialize(name, '', { ...options, maxAge: -1 });
          headers.append('Set-Cookie', newCookie);
        },
      },
    }
  );
};
