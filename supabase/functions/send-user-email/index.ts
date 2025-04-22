
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    console.log(`Received contact form submission from ${name} (${email})`);

    // Basic validation
    if (!name || name.length < 2) {
      return new Response(JSON.stringify({ error: "Vārds ir obligāts un jābūt vismaz 2 simboliem." }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }});
    }
    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Nederīga e-pasta adrese." }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }});
    }
    if (!message || message.length < 10) {
      return new Response(JSON.stringify({ error: "Ziņojums ir obligāts un jābūt vismaz 10 simboliem." }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }});
    }

    // SendGrid configuration
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    
    if (!SENDGRID_API_KEY) {
      throw new Error("SendGrid API key is not configured");
    }

    // Prepare the email request to SendGrid
    const sendgridData = {
      personalizations: [
        {
          to: [{ email: "info@netieku.es" }],
          subject: `Netieku.es | Kontaktformas ziņa (${name}, ${email})`,
        },
      ],
      from: { email: "noreply@netieku.es", name: "Netieku.es" },
      content: [
        {
          type: "text/html",
          value: `
            <h2>Jauna ziņa no kontaktformas!</h2>
            <b>No:</b> ${name} (${email})<br/>
            <b>Ziņa:</b><br/>
            <div style="white-space: pre-wrap">${message}</div>
          `,
        },
      ],
    };

    // Send the email using SendGrid API
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendgridData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("SendGrid API error:", response.status, errorData);
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    console.log("Email sent successfully via SendGrid");

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Function error:", error.message || "Unknown error");
    return new Response(JSON.stringify({ error: error?.message || "Nezināma kļūda" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
