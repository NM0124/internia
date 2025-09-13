// src/services/supabaseInternshipService.ts
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with your environment variables
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// ✅ Fetch internships from your table
export async function fetchInternships() {
  const { data, error } = await supabase.from("internship_listings").select("*");

  if (error) {
    console.error("Error fetching internships:", error.message);
    throw error;
  }

  return data || [];
}

// ✅ Ask backend API for AI recommendations
export async function getRecommendedInternships(userQuery: string) {
  const internships = await fetchInternships();

  console.log("Sending to AI route:", {
    internshipsCount: internships.length,
    userQuery,
  });

  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ internships, userQuery }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("AI route error:", errorText);
    throw new Error("Failed to fetch AI recommendations");
  }

  const data = await res.json();
  return data.result; // AI text response
}
