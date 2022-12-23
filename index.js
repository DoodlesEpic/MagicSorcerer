import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// API route
app.post("/api/v1/completions", async (req, res) => {
  const { model, prompt } = req.body;

  if (!model || !prompt) {
    return res.status(400).send({ error: "Model and prompt are required" });
  }

  if (
    ![
      "ada",
      "text-babbage-001",
      "text-babbage-002",
      "text-curie-001",
      "text-davinci-002",
    ].includes(model)
  ) {
    return res.status(400).send({ error: "Invalid model" });
  }

  if (prompt.length > 10000) {
    return res.status(400).send({ error: "Prompt is too long" });
  }

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify({
      model,
      prompt: `${prompt} Above is a Magic The Gathering decklist, I would like to receive some suggestions for cards I should add or remove from this deck to make it more powerful. Please separate each suggestion with a newline.`,
      max_tokens: 100,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).send({ error: response.statusText });
  }

  const data = await response.json();
  const completion = data.choices[0].text;
  res.send({ completion });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
