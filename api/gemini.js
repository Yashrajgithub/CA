export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const { prompt } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: "API key missing in environment" });
  }

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Generate a short, vivid, and imaginative dream scenario based on the following theme/mood: "${prompt}". Focus on sensory details and a surreal atmosphere. Keep it concise, around 3-4 sentences.`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    // If API returns an error object
    if (data.error) {
      console.error("Gemini API error:", data.error);
      return res.status(500).json({ error: data.error.message || "Unknown Gemini API error" });
    }

    const dreamText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (dreamText) {
      res.status(200).json({ text: dreamText });
    } else {
      console.warn("Unexpected Gemini response:", JSON.stringify(data, null, 2));
      res.status(500).json({ error: "Malformed response", raw: data });
    }
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
