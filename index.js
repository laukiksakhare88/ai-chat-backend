app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // ✅ SAFE TEXT EXTRACTION
    let reply =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        ?.join("") ||
      data?.candidates?.[0]?.content?.text ||
      "No answer generated";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
