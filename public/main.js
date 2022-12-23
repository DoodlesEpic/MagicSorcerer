const form = document.getElementById("form");
const responseDiv = document.getElementById("response");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const model = document.getElementById("model").value;
  const apiKey = document.getElementById("apiKey").value;
  const prompt = document.getElementById("prompt").value;

  const response = await generateResponse(model, apiKey, prompt);
  responseDiv.innerHTML = response;
});

async function generateResponse(model, prompt) {
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + apiKey,
    },
    body: JSON.stringify({
      model,
      prompt: `${prompt} This is my current Magic The Gathering decklist, I would like to receive some suggestions for cards I should add or remove from this deck to make it more powerful. Be short please.`,
      max_tokens: 100,
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  const completion = data.choices[0].text;
  return completion;
}
