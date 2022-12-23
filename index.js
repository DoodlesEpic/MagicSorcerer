import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import morgan from "morgan";
import hpp from "hpp";

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

// Limit requests to once every 10 seconds
const noSpam = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1,
  message: "Too many requests, please try again later",
});

app.use(morgan("combined")); // logs HTTP requests to stdout
app.use(helmet());
app.use("/api", rateLimiter);
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(hpp());

// API route
app.post(
  "/api/v1/completions",
  noSpam,
  body("model")
    .isIn([
      "ada",
      "text-babbage-001",
      "text-babbage-002",
      "text-curie-001",
      "text-davinci-002",
    ])
    .withMessage("Invalid model"),
  body("prompt")
    .isLength({ min: 100, max: 10000 })
    .withMessage("Decklist must be between 100 and 10000 characters")
    .trim()
    .escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        error: errors
          .array()
          .map((error) => error.msg)
          .join(". "),
      });
    }

    const { model, prompt } = req.body;

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
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
