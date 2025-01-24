import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact' });

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Supabase',
      data: data 
    });
  } catch (error) {
    console.error('Supabase connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to connect to Supabase', 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

