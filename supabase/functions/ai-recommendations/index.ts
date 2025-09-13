import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";  // Import OpenAI

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  education: string;
  skills: string[];
  sectors: string[];
  location: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile }: { userProfile: UserProfile } = await req.json();

    // ✅ Supabase Client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ✅ Fetch internships
    const { data: internships, error } = await supabase
      .from("internship_listings")
      .select("id, title, description, skills, sector, location, education")
      .eq("is_active", true);

    if (error) throw new Error("Failed to fetch internships");

    // ✅ OpenAI Client
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY")!,
    });

    // ✅ Build prompt for GPT
    const prompt = `
You are an AI career assistant.
User profile:
- Education: ${userProfile.education}
- Skills: ${userProfile.skills.join(", ")}
- Interests: ${userProfile.sectors.join(", ")}
- Location: ${userProfile.location}

Here are internship options:
${internships.map(i => `• ${i.title} (${i.location}) | Skills: ${i.skills} | Sector: ${i.sector}`).join("\n")}

Pick the top 3 best matches. Return JSON only:
[
  { "id": internship_id, "reason": "why this internship is a good fit" }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const recommendations = completion.choices[0].message.content;

    return new Response(recommendations, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
