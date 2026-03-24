import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// --- SAFETY CHECK ---
// This helps you debug "White Screen of Death" issues during development
if (!supabaseUrl || !supabaseKey) {
  console.error(
    'MISSING SUPABASE CREDENTIALS: Check your .env file. ' +
    'The app will not be able to connect to the database.'
  )
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseKey || ''
)