
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
    console.log("Saņemts pieprasījums contact-form-email funkcijai");
    const { name, email, message }: ContactFormRequest = await req.json();
    console.log(`Kontaktforma dati: ${name}, ${email}, ziņojuma garums: ${message?.length || 0}`);

    if (!name || !email || !message) {
      console.error("Trūkst obligāto lauku datu");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (!email.includes('@')) {
      console.error("Nederīga e-pasta adrese:", email);
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

    // Labojam e-pasta konfigurāciju, lai novērstu bounce
    const emailResponse = await resend.emails.send({
      from: "kontaktforma@netieku.es", // Izmantojam derīgu domēna adresi
      to: ["info@netieku.es"],
      reply_to: email, // Iestatām reply-to uz sūtītāja adresi
      subject: `Netieku.es | Ziņa no kontaktformas (${name})`,
      html,
    });

    console.log("Resend API atbilde:", JSON.stringify(emailResponse));

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
      JSON.stringify({ error: error?.message || "Unexpected error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
