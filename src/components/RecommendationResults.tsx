// src/components/RecommendationResults.tsx
import { useEffect, useState } from "react";
import { fetchInternships, getRecommendedInternships } from "../services/supabaseInternshipService";

interface Props {
  userQuery?: string; // optional because sometimes parent may not provide it
}

export default function RecommendationResults({ userQuery }: Props) {
  const [recommendations, setRecommendations] = useState<string>("Waiting for a query...");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If userQuery is missing or empty, don't call the API.
    if (!userQuery || userQuery.trim().length === 0) {
      setRecommendations("Enter a query to get AI recommendations.");
      setError(null);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setRecommendations("Loading recommendations...");

        // Use the exported helper that will default userQuery if needed
        const result = await getRecommendedInternships(userQuery);
        setRecommendations(result || "No recommendations received.");
      } catch (err: any) {
        console.error("🔥 Error fetching recommendations:", err);
        // If the error contains text from the API, show a helpful message:
        const msg = err?.message || "Could not get AI recommendations";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userQuery]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">AI Recommendations</h2>
