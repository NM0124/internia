// src/components/RecommendationResults.tsx
import { useEffect, useState } from "react";
import { fetchInternships } from "../services/supabaseInternshipService"; // ✅ assuming you already have this

interface Props {
  userQuery: string;
}

export default function RecommendationResults({ userQuery }: Props) {
  const [recommendations, setRecommendations] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // 1️⃣ Get internships from Supabase
        const internships = await fetchInternships();

        // Debug
        console.log("Sending to API:", { internships, userQuery });

        // 2️⃣ Send them + user query to your API
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            internships,
            userQuery,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI recommendations");
        }

        const data = await response.json();

        // 3️⃣ Save result from API
        setRecommendations(data.result || "No recommendations received");
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Could not get AI recommendations");
      }
    }

    load();
  }, [userQuery]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">AI Recommendations</h2>
      <p className="whitespace-pre-line">{recommendations}</p>
    </div>
  );
}
