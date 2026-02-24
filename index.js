import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { major, interest } = req.body;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert university graduation project advisor."
          },
          {
            role: "user",
            content: `Generate 5 creative graduation project ideas for ${major} with interest in ${interest}.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    res.json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
