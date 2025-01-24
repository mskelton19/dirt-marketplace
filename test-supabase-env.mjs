import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Supabase Environment Variables Check:')

if (supabaseUrl) {
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
} else {
  console.log('NEXT_PUBLIC_SUPABASE_URL is missing')
}

if (supabaseAnonKey) {
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', `${supabaseAnonKey.slice(0, 5)}...${supabaseAnonKey.slice(-5)}`)
} else {
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
}

if (supabaseServiceKey) {
  console.log('SUPABASE_SERVICE_ROLE_KEY:', `${supabaseServiceKey.slice(0, 5)}...${supabaseServiceKey.slice(-5)}`)
} else {
  console.log('SUPABASE_SERVICE_ROLE_KEY is missing')
}

if (supabaseUrl && supabaseAnonKey) {
  console.log('\nAttempting to create Supabase client...')
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client created successfully')
    
    // Attempt a simple query to verify connection
    console.log('\nAttempting a simple query...')
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact' })
    
    if (error) {
      console.error('Query failed:', error.message)
    } else {
      console.log('Query successful. Row count:', data[0].count)
    }
  } catch (error) {
    console.error('Failed to create Supabase client:', error.message)
  }
} else {
  console.log('\nCannot create Supabase client due to missing variables')
}