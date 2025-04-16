'use client';

import { supabase } from './client';

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return data.session?.user ?? null;
}
