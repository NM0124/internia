import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { internships, userQuery } = req.body;

    if (!internships || !userQuery) {
      return res.status(400).json({ error: "Missing internships or userQuery" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that recommends the best internships for students based on their query and available options.",
        },
        {
          role: "user",
          content: `Student query: ${userQuery}\nInternships: ${JSON.stringify(
            internships
          )}`,
        },
      ],
    });

    res.status(200).json({
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
}
