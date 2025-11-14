// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Read CRA envs (webpack / react-scripts)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL ?? null
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY ?? null

console.info('[supabaseClient] CRA env SUPABASE_URL present:', Boolean(SUPABASE_URL))
console.info('[supabaseClient] CRA env SUPABASE_ANON_KEY present:', Boolean(SUPABASE_ANON_KEY))

let supabase = null

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[supabaseClient] Supabase env vars not found (REACT_APP_*). Using stub.')
  supabase = {
    auth: {
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
    },
    from: () => ({
      insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
      select: async () => ({ data: null, error: new Error('Supabase not configured') }),
      update: async () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: async () => ({ data: null, error: new Error('Supabase not configured') }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ publicURL: null }),
      }),
    },
  }
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  console.info('[supabaseClient] Supabase client created.')
}

export { supabase }
