
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, user_email, first_name, last_name, phone_number } = await req.json()

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log("Creating/updating user profile:", { user_id, user_email, first_name, last_name });
    
    // Use the stored procedure we've created
    const { data, error } = await supabase.rpc('create_user_profile', {
      user_id: user_id,
      user_email: user_email,
      first_name: first_name || null,
      last_name: last_name || null,
      phone_number: phone_number || null
    })

    if (error) {
      console.error('Error creating/updating user profile:', error)
      return new Response(JSON.stringify({ error }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error) {
    console.error('Error in edge function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })
  }
})
