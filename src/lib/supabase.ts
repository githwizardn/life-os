import { createClient } from '@supabase/supabase-js'

// These values come from .env file
// VITE_ prefix is required for Vite to expose them to the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)