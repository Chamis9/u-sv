
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
  fromContact?: boolean; // Jauns lauks, kas norāda, vai e-pasts ir no kontaktformas
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, fromContact }: EmailRequest = await req.json();

    console.log(`Sending email ${fromContact ? "from contact form to" : "to"} ${to} with subject: ${subject}`);
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

    // Atšķirīga konfigurācija atkarībā vai e-pasts nāk no kontaktformas vai no admin paneļa
    const emailConfig = fromContact ? {
      from: "Kontaktforma <onboarding@resend.dev>", // Kontaktformas gadījumā
      to: ["info@netieku.es"], // Vienmēr sūtām uz info@netieku.es no kontaktformas
      reply_to: to, // Atvieglojam atbildēšanu, iestatot reply_to uz sūtītāja e-pastu
      subject: subject,
      html: message,
    } : {
      from: "netieku.es <onboarding@resend.dev>", // Admin e-pasts lietotājam
      to: [to], // Sūtām uz norādīto e-pastu
      subject: subject,
      html: message,
    };

    console.log("Email configuration:", JSON.stringify(emailConfig));

    const emailResponse = await resend.emails.send(emailConfig);

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
