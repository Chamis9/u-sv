import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get the token from the Authorization header
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )
    
    // Get user info
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const { action, ticketId, userId, ...otherData } = await req.json()
    
    // Parse request URL to get the path
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    // Handle different API endpoints
    if (req.method === 'GET' && path === 'my-tickets') {
      // Get user tickets from the tickets table
      const { data, error } = await supabaseClient
        .from('tickets')
        .select('*')
        .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)
      
      if (error) {
        console.error(`Error fetching tickets:`, error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ tickets: data }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else if (req.method === 'POST' && path === 'create-ticket') {
      // Create a new ticket
      const { title, price, categoryName, description, filePath, eventDate, venue, categoryId } = otherData
      
      console.log(`Creating ticket with data:`, JSON.stringify(otherData, null, 2));
      
      // Always use the authenticated user's ID
      const { data, error } = await supabaseClient
        .from('tickets')
        .insert({
          title: title,
          description: description,
          price: price,
          user_id: user.id,
          seller_id: user.id,
          owner_id: user.id,
          category_id: categoryId,
          category_name: categoryName,
          file_path: filePath,
          status: 'available',
          event_date: eventDate,
          venue: venue
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating ticket:`, error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      return new Response(JSON.stringify({ ticket: data }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else if (req.method === 'POST' && path === 'tickets-management' && action === 'soft-delete-ticket') {
      // Handle soft delete operation
      if (!ticketId) {
        return new Response(JSON.stringify({ error: 'No ticket ID provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      console.log(`Attempting to soft delete ticket: ${ticketId} for user: ${user.id}`);
      
      // First check if the ticket belongs to the user
      const { data: ticketData, error: fetchError } = await supabaseClient
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .maybeSingle()
      
      if (fetchError) {
        console.error('Error fetching ticket:', fetchError)
        return new Response(JSON.stringify({ error: fetchError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      if (!ticketData) {
        console.error('Ticket not found:', ticketId)
        return new Response(JSON.stringify({ error: 'Ticket not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Verify ownership
      if (ticketData.seller_id !== user.id || ticketData.owner_id !== user.id || ticketData.buyer_id !== null) {
        console.error('Unauthorized delete attempt:', {
          ticketId,
          userId: user.id,
          sellerId: ticketData.seller_id,
          ownerId: ticketData.owner_id,
          buyerId: ticketData.buyer_id
        })
        return new Response(JSON.stringify({ error: 'Unauthorized: You can only delete your own unsold tickets' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Now copy the ticket to deleted_tickets table
      const { error: insertError } = await supabaseClient
        .from('deleted_tickets')
        .insert({
          original_id: ticketData.id,
          title: ticketData.title,
          description: ticketData.description,
          price: ticketData.price,
          category_name: ticketData.category_name,
          venue: ticketData.venue,
          seat_info: ticketData.seat_info,
          file_path: ticketData.file_path,
          category_id: ticketData.category_id,
          event_date: ticketData.event_date,
          event_time: ticketData.event_time,
          event_id: ticketData.event_id,
          price_per_unit: ticketData.price_per_unit,
          quantity: ticketData.quantity,
          user_id: ticketData.user_id,
          seller_id: ticketData.seller_id,
          buyer_id: ticketData.buyer_id,
          owner_id: ticketData.owner_id,
          created_at: ticketData.created_at,
          updated_at: ticketData.updated_at
        })
      
      if (insertError) {
        console.error('Error copying ticket to deleted_tickets:', insertError)
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Now delete the original ticket record - CRITICAL PART THAT MUST WORK
      const { error: deleteError } = await supabaseClient
        .from('tickets')
        .delete()
        .eq('id', ticketId)
      
      if (deleteError) {
        console.error('Error deleting original ticket:', deleteError)
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      console.log(`Successfully soft deleted ticket: ${ticketId}`)
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else if (req.method === 'DELETE' && path === 'delete-ticket') {
      // For backward compatibility, redirect to soft-delete functionality
      const { ticketId } = otherData
      
      if (!ticketId) {
        return new Response(JSON.stringify({ error: 'No ticket ID provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      console.log(`Delete request redirecting to soft-delete for ticket: ${ticketId}`);
      
      // Call the soft-delete implementation
      const softDeleteResponse = await fetch(new URL(req.url).origin + '/tickets-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          action: 'soft-delete-ticket',
          ticketId,
          userId: user.id
        })
      });
      
      return softDeleteResponse;
    } else {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('[Edge] Unhandled error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
