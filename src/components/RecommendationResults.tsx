// src/components/RecommendationResults.tsx
import { useEffect, useState } from "react";
import { getRecommendedInternships } from "../services/supabaseInternshipService";

interface Props {
  userQuery: string;
}

export default function RecommendationResults({ userQuery }: Props) {
  const [recommendations, setRecommendations] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getRecommendedInternships(userQuery);
        setRecommendations(result);
      } catch (err) {
        console.error(err);
        setError("Could not load AI recommendations");
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

