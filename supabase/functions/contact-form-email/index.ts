
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Ielādē Resend API key no Supabase secrets
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
  // Atbild uz CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactFormRequest = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (!email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Izveido sūtāmo epasta tekstu
    const html = `
      <h2>Saņemta jauna ziņa no netieku.es kontaktformas!</h2>
      <b>No:</b> ${name} (${email})<br/>
      <b>Ziņojums:</b><br/>
      <div style="white-space: pre-wrap">${message}</div>
    `;

    // Sūta e-pastu uz info@netieku.es
    const emailResponse = await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>", // ja vēlies, nomaini uz savu domēnu
      to: ["info@netieku.es"],
      subject: `Netieku.es | Ziņa no kontaktformas (${name}, ${email})`,
      html,
    });

    if (emailResponse.error) {
      throw new Error(`Resend API error: ${emailResponse.error.message || JSON.stringify(emailResponse.error)}`);
    }

    return new Response(JSON.stringify({ success: true, result: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending contact form email:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unexpected error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
