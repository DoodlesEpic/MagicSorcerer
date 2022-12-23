import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { API_KEY } from '$env/static/private';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const model = formData.get('model');
		const decklist = formData.get('decklist');

		const response = await fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_KEY}`
			},
			body: JSON.stringify({
				model,
				prompt: `${decklist} Above is a Magic The Gathering decklist, I would like to receive some suggestions for cards I should add or remove from this deck to make it more powerful. Please separate each suggestion with a newline.`,
				max_tokens: 100,
				temperature: 0.5
			})
		});

		if (!response.ok) {
			return fail(400, { error: response.statusText });
		}

		const data = await response.json();
		const completion = data.choices[0].text;
		return { completion };
	}
};
