import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Limit requests to 100 per day
const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 60 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests, please try again later",
});

// Limit requests to once every 30 seconds
const noSpam = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1,
  message: "Too many requests, please try again later",
});

app.use(helmet());
app.use("/api", rateLimiter);
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// API route
app.post("/api/v1/completions", noSpam, async (req, res) => {
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
