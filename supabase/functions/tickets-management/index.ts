
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createSupabaseClient, supabaseClient } from "./supabase-client.ts";
import { corsHeaders } from "./cors.ts";
import { RequestPayload } from "./types.ts";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createNotFoundResponse, 
  createUnauthorizedResponse, 
  createOptionsResponse 
} from "./response-utils.ts";
import { 
  getMyTickets, 
  createTicket, 
  updateTicket, 
  softDeleteTicket 
} from "./handlers.ts";

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return createOptionsResponse();
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createUnauthorizedResponse('No authorization header');
    }

    // Get the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Initialize the global supabaseClient
    Object.assign(globalThis, { supabaseClient: createSupabaseClient(token) });
    
    // Get user info
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return createUnauthorizedResponse();
    }

    // Parse URL to get the path
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle different endpoints based on HTTP method and path
    if (req.method === 'GET' && path === 'my-tickets') {
      try {
        const tickets = await getMyTickets(user.id);
        return createSuccessResponse({ tickets });
      } catch (error: any) {
        return createErrorResponse(error.message);
      }
    } 
    else if (req.method === 'POST') {
      // Parse request body for all POST requests
      const requestData: RequestPayload = await req.json();
      
      if (path === 'create-ticket') {
        try {
          const ticket = await createTicket(user.id, requestData);
          return createSuccessResponse({ ticket }, 201);
        } catch (error: any) {
          return createErrorResponse(error.message);
        }
      }
      else if (path === 'tickets-management') {
        const { action, ticketId } = requestData;
        
        if (action === 'update-ticket' && ticketId) {
          try {
            const updatedTicket = await updateTicket(ticketId, user.id, requestData);
            return createSuccessResponse({ success: true, ticket: updatedTicket });
          } catch (error: any) {
            return createErrorResponse(error.message);
          }
        }
        else if (action === 'soft-delete-ticket' && ticketId) {
          try {
            await softDeleteTicket(ticketId, user.id);
            return createSuccessResponse({ success: true });
          } catch (error: any) {
            if (error.message.includes('Unauthorized')) {
              return createUnauthorizedResponse(error.message);
            }
            return createErrorResponse(error.message);
          }
        }
      }
    }
    else if (req.method === 'DELETE' && path === 'delete-ticket') {
      // For backward compatibility, redirect to soft-delete functionality
      const { ticketId } = await req.json();
      
      if (!ticketId) {
        return createErrorResponse('No ticket ID provided', 400);
      }
      
      console.log(`Delete request redirecting to soft-delete for ticket: ${ticketId}`);
      
      try {
        await softDeleteTicket(ticketId, user.id);
        return createSuccessResponse({ success: true });
      } catch (error: any) {
        if (error.message.includes('Unauthorized')) {
          return createUnauthorizedResponse(error.message);
        }
        return createErrorResponse(error.message);
      }
    }
    
    return createNotFoundResponse();
    
  } catch (error: any) {
    console.error('[Edge] Unhandled error:', error);
    return createErrorResponse('Internal Server Error');
  }
});
