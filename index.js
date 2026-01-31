import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "You are a strict but motivating study mentor. Explain clearly.\nUser: " +
                  userMessage
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

  res.json({ reply });
});

app.listen(3000, () => console.log("Server running"));
