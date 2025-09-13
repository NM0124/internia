// api/recommend.js
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
      model: "gpt-4o-mini", // you can switch to gpt-4o or gpt-3.5-turbo if needed
      messages: [
        {
          role: "system",
          content:
            "You are an AI that recommends the best internships for students based on their query and available opt
