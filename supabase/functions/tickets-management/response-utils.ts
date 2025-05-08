
import { corsHeaders } from "./cors.ts";

// Utility functions for creating standardized responses
export function createSuccessResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export function createErrorResponse(error: string, status = 500) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export function createNotFoundResponse() {
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export function createUnauthorizedResponse(message = 'Unauthorized') {
  return new Response(JSON.stringify({ error: message }), {
    status: 401, 
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export function createOptionsResponse() {
  return new Response(null, { headers: corsHeaders });
}
