
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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message }: EmailRequest = await req.json();

    console.log(`Sending email to ${to} with subject: ${subject}`);
    console.log(`Using API key: ${Deno.env.get("RESEND_API_KEY") ? "API key exists" : "API key is missing"}`);

    // Verify email address format
    if (!to || !to.includes('@')) {
      console.error("Invalid email address:", to);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate input
    if (!subject || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Subject and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "netieku.es <onboarding@resend.dev>", // Atjaunojam nosaukumu
      to: [to],
      subject: subject,
      html: message,
    });

    console.log("Email send response:", JSON.stringify(emailResponse));

    if (emailResponse.error) {
      throw new Error(`Resend API error: ${emailResponse.error.message || JSON.stringify(emailResponse.error)}`);
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
