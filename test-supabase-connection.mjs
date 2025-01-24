import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testSupabaseConnection() {
  try {
    // Test direct Supabase connection
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact' })
    
    if (error) throw error

    console.log('Direct Supabase Connection Test Result:')
    console.log(JSON.stringify({ success: true, message: 'Successfully connected to Supabase', data }, null, 2))
    console.log('✅ Supabase connection successful')

    // Test API route
    const response = await fetch('http://localhost:3000/api/test-supabase')
    const apiData = await response.json()

    console.log('\nAPI Route Test Result:')
    console.log(JSON.stringify(apiData, null, 2))

    if (apiData.success) {
      console.log('✅ API route connection successful')
    } else {
      console.log('❌ API route connection failed')
    }
  } catch (error) {
    console.error('Error testing Supabase connection:', error)
    console.log('❌ Supabase connection failed')
  }
}

testSupabaseConnection()

