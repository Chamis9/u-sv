
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

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { name, email, message }: ContactFormRequest = await req.json();

    // Pieņemts, ka formā ir validācija, bet veicam arī elementāru validāciju backend pusē
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Nosūtām epastu uz info@netieku.es ar klienta datiem
    const emailResponse = await resend.emails.send({
      from: "netieku.es <info@netieku.es>",
      to: ["info@netieku.es"],
      reply_to: email,
      subject: "Jauns ziņojums no kontakta formas",
      html: `
        <div>
          <h2>Jauns ziņojums no netieku.es kontakta formas</h2>
          <p><b>Vārds:</b> ${name}</p>
          <p><b>E-pasts:</b> ${email}</p>
          <p><b>Ziņojums:</b></p>
          <pre style="background:#f6f6f6;border-radius:4px;padding:10px">${message}</pre>
        </div>
      `,
    });

    if (emailResponse?.error) {
      throw new Error(emailResponse.error);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Resend kontaktformas kļūda:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
