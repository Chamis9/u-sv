
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactFormRequest = await req.json();

    console.log(`Processing contact form submission from ${name} (${email})`);
    console.log(`Using API key: ${Deno.env.get("RESEND_API_KEY") ? "API key exists" : "API key is missing"}`);

    // Validate input
    if (!name || !email || !message) {
      console.error("Missing required fields in contact form submission");
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Verify email address format
    if (!email.includes('@')) {
      console.error("Invalid email address in contact form:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const htmlMessage = `
      <h2>Saņemta jauna ziņa no netieku.es kontaktformas!</h2>
      <b>No:</b> ${name} (${email})<br/>
      <b>Ziņojums:</b><br/>
      <div style="white-space: pre-wrap">${message}</div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Netieku.es <info@netieku.es>",
      to: ["info@netieku.es"],
      subject: `Netieku.es | Ziņa no kontaktformas (${name}, ${email})`,
      html: htmlMessage,
    });

    console.log("Contact form email response:", JSON.stringify(emailResponse));

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
    console.error("Error sending contact form email:", error);
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
