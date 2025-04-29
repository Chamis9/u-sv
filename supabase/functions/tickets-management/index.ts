
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

    // Parse request URL to get the path
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    // Handle different API endpoints
    if (req.method === 'GET' && path === 'my-tickets') {
      // Get user tickets from all ticket tables
      const ticketTables = [
        'tickets_theatre', 'tickets_concerts', 'tickets_sports', 
        'tickets_festivals', 'tickets_cinema', 'tickets_children', 
        'tickets_travel', 'tickets_giftcards', 'tickets_other'
      ];
      
      let allTickets: any[] = [];
      
      for (const tableName of ticketTables) {
        const { data, error } = await supabaseClient
          .from(tableName)
          .select('*, categories(name)')
          .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)
        
        if (error) {
          console.error(`Error fetching tickets from ${tableName}:`, error)
          continue;
        }
        
        if (data && data.length > 0) {
          allTickets = [...allTickets, ...data.map(ticket => ({
            ...ticket,
            tableName // Include table name for reference
          }))]
        }
      }

      return new Response(JSON.stringify({ tickets: allTickets }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else if (req.method === 'POST' && path === 'create-ticket') {
      // Create a new ticket
      const body = await req.json()
      const { title, price, categoryName, description, filePath, eventDate, venue } = body
      
      // Determine table name from category
      let tableName = 'tickets_other'
      
      if (categoryName) {
        const categoryToTable: Record<string, string> = {
          'Theatre': 'tickets_theatre',
          'Teātris': 'tickets_theatre',
          'Concerts': 'tickets_concerts',
          'Koncerti': 'tickets_concerts',
          'Sports': 'tickets_sports',
          'Festivals': 'tickets_festivals',
          'Festivāli': 'tickets_festivals',
          'Cinema': 'tickets_cinema',
          'Kino': 'tickets_cinema',
          'Children': 'tickets_children',
          'Bērniem': 'tickets_children',
          'Travel': 'tickets_travel',
          'Ceļojumi': 'tickets_travel',
          'Gift Cards': 'tickets_giftcards',
          'Dāvanu kartes': 'tickets_giftcards'
        }
        
        tableName = categoryToTable[categoryName] || 'tickets_other'
      }
      
      // Get category ID if provided
      let categoryId = null
      if (categoryName) {
        const { data: categoryData } = await supabaseClient
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .single()
        
        if (categoryData) {
          categoryId = categoryData.id
        }
      }
      
      // Always use the authenticated user's ID
      const { data, error } = await supabaseClient
        .from(tableName)
        .insert({
          description: title,
          price: price,
          user_id: user.id,
          seller_id: user.id,
          owner_id: user.id,
          category_id: categoryId,
          file_path: filePath,
          status: 'available',
          event_date: eventDate,
          venue: venue
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating ticket in ${tableName}:`, error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      return new Response(JSON.stringify({ ticket: data }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else if (req.method === 'DELETE' && path === 'delete-ticket') {
      // Delete a ticket
      const body = await req.json()
      const { ticketId, tableName } = body
      
      if (!tableName) {
        return new Response(JSON.stringify({ error: 'Table name is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Validate table name
      const validTableNames = [
        'tickets_theatre', 'tickets_concerts', 'tickets_sports', 
        'tickets_festivals', 'tickets_cinema', 'tickets_children', 
        'tickets_travel', 'tickets_giftcards', 'tickets_other'
      ];
      
      if (!validTableNames.includes(tableName)) {
        return new Response(JSON.stringify({ error: 'Invalid table name' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // First check if the ticket belongs to the user
      const { data: ticketData, error: fetchError } = await supabaseClient
        .from(tableName)
        .select('user_id, file_path')
        .eq('id', ticketId)
        .single()
      
      if (fetchError) {
        console.error('Error fetching ticket:', fetchError)
        return new Response(JSON.stringify({ error: fetchError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Verify ownership
      if (ticketData.user_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: You can only delete your own tickets' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Delete any associated file
      if (ticketData.file_path) {
        const { error: storageError } = await supabaseClient.storage
          .from('tickets')
          .remove([ticketData.file_path])
        
        if (storageError) {
          console.warn('Error deleting file:', storageError)
          // Continue with ticket deletion even if file deletion fails
        }
      }
      
      // Delete the ticket
      const { error: deleteError } = await supabaseClient
        .from(tableName)
        .delete()
        .eq('id', ticketId)
      
      if (deleteError) {
        console.error('Error deleting ticket:', deleteError)
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
