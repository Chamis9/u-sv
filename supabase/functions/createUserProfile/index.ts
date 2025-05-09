
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, user_email, first_name, last_name, phone_number } = await req.json()

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('registered_users')
      .select('id')
      .eq('auth_user_id', user_id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking if user exists:', checkError)
      return new Response(JSON.stringify({ error: checkError }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    if (existingUser) {
      // User already exists, return success
      return new Response(JSON.stringify({ success: true, id: existingUser.id }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create new user profile
    const { data, error } = await supabase
      .from('registered_users')
      .insert({
        auth_user_id: user_id,
        email: user_email,
        first_name: first_name,
        last_name: last_name,
        phone: phone_number,
        last_sign_in_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      return new Response(JSON.stringify({ error: error }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in edge function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
