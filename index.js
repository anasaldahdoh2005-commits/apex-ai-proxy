import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { major, interest } = req.body;

    const prompt = `
Generate 5 creative graduation project ideas for a ${major} student.
${interest ? "Focus on this interest: " + interest : ""}
Return them as a numbered list.
`;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a creative project idea generator." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // فحص الأخطاء
    if (!response.ok) {
      return res.status(500).json({
        error: "DeepSeek API Error",
        details: data
      });
    }

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({
        error: "No choices returned from DeepSeek",
        details: data
      });
    }

    res.json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
