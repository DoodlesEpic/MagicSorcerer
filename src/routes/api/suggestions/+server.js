import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { model, decklist } = await request.json();

	const response = await fetch('https://api.openai.com/v1/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.API_KEY}`
		},
		body: JSON.stringify({
			model,
			prompt: `${decklist} Above is a Magic The Gathering decklist, I would like to receive some suggestions for cards I should add or remove from this deck to make it more powerful. Please separate each suggestion with a newline.`,
			max_tokens: 100,
			temperature: 0.5
		})
	});

	if (!response.ok) {
		throw error(400, response.statusText);
	}

	const data = await response.json();
	const completion = data.choices[0].text;
	return json({ completion });
}
