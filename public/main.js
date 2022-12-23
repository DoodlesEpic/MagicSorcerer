const form = document.getElementById("form");
const responseDiv = document.getElementById("response");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const model = document.getElementById("model").value;
  const prompt = document.getElementById("prompt").value;

  const response = await generateResponse(model, prompt);
  responseDiv.innerHTML = response;
});

async function generateResponse(model, prompt) {
  const response = await fetch("/api/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
    }),
  });

  const data = await response.json();
  if (data.error) return data.error;
  return data.completion.replace(/^\d+[. ]/gm, "<br>$&");
}
