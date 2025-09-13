// api/recommend.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { internships, userQuery } = req.body;

    // Debug logs for safety
    console.log("Incoming request body:", req.body);

    if (!internships || internships.length === 0) {
      return res.status(400).json({ 
        error: "No internships provided", 
        details: { internships } 
      });
    }

    if (!userQuery || userQuery.trim().length === 0) {
      return res.status(400).json({ 
        error: "No userQuery provided", 
        details: { userQuery } 
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI that recommends the best internships for students based on their query and available options." },
        { role: "user", content: `Student query: ${userQuery}\nInternships: ${JSON.stringify(internships)}` },
      ],
    });

    return res.status(200).json({
      result: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("OpenAI error:", error);

    return res.status(500).json({ 
      error: "Failed to generate recommendations", 
      details: error.message || error 
    });
  }
}
