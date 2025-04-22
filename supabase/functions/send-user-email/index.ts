
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  from?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Pārbaudām, vai ir pieejama API atslēga
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "API key is not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { to, subject, message, from }: EmailRequest = await req.json();
    
    // Pārbaudām obligātos laukus
    if (!to || !subject || !message) {
      console.error("Missing required fields", { to, subject, message: message ? "present" : "missing" });
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Attempting to send email to ${to} with subject: ${subject}`);
    
    const senderEmail = from || "Netieku.es <info@netieku.es>";
    
    const emailResponse = await resend.emails.send({
      from: senderEmail,
      to: [to],
      subject: subject,
      html: message,
    });

    console.log("Email send response:", JSON.stringify(emailResponse));

    if (emailResponse.error) {
      throw new Error(`Resend API error: ${JSON.stringify(emailResponse.error)}`);
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    console.error("Error details:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: typeof error === 'object' ? Object.getOwnPropertyNames(error).reduce((acc, key) => {
          acc[key] = String(error[key]);
          return acc;
        }, {} as Record<string, string>) : null
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
