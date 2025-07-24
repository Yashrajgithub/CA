export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const { userPrompt } = req.body;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Generate a short, vivid, and imaginative dream scenario based on the following theme/mood: "${userPrompt}". Focus on sensory details and a surreal atmosphere. Keep it concise, around 3-4 sentences.`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
}



                    const apiKey = "AIzaSyDZQieK82_j6n6yKQ9a91gDI0DcQGoan4E"; // Placeholder for the actual API key
