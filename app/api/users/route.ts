import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, zipCode, companyName, role, password, contactPreference } = body;

    console.log('Attempting to create user with email:', email);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error('Supabase Auth Error:', JSON.stringify(authError, null, 2));
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      console.error('User creation failed: No user data returned');
      return NextResponse.json({ error: 'User creation failed. Please try again.' }, { status: 400 });
    }

    console.log('User created successfully. Attempting to insert profile data.');
    console.log('Profile data:', JSON.stringify({
      user_id: authData.user.id,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      zip_code: zipCode,
      company_name: companyName,
      role: role,
    }, null, 2));

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        { 
          user_id: authData.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          zip_code: zipCode,
          company_name: companyName,
          role: role,
          contact_preference: contactPreference,
        }
      ])
      .select();

    if (profileError) {
      console.error('Supabase Insert Error:', JSON.stringify(profileError, null, 2));
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Failed to create user profile. Please try again.' }, { status: 500 });
    }

    if (!profileData || profileData.length === 0) {
      console.error('Profile creation failed: No profile data returned');
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Failed to create user profile. Please try again.' }, { status: 500 });
    }

    console.log('User profile created successfully.');
    return NextResponse.json({ user: authData.user, profile: profileData[0] }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}

