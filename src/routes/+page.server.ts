import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { API_KEY } from '$env/static/private';
import validator from 'validator';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const model: string = validator.trim(formData.get('model') as string);
		const decklist: string = validator.trim(formData.get('decklist') as string);
		const format: string = validator.trim(formData.get('format') as string);

		if (!validator.isLength(decklist, { min: 100, max: 10000 })) {
			return fail(400, { error: 'Insert a valid decklist' });
		}

		if (!validator.isIn(model, ['ada', 'text-babbage-001', 'text-curie-001', 'text-davinci-003'])) {
			return fail(400, { error: 'Choose a valid model' });
		}

		if (!validator.isIn(format, ['commander', 'standard', 'modern', 'historic'])) {
			return fail(400, { error: 'Choose a valid format' });
		}

		const response = await fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_KEY}`
			},
			body: JSON.stringify({
				model,
				prompt: `${decklist} Above is a Magic The Gathering decklist for ${format}, give me suggestions for cards I should add and/or remove from the deck to increase its power level. Explain each decision with up to 10 words. Before the suggestions give me my current power level and the expected power level after changes.`,
				max_tokens: 100,
				temperature: 0.7
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
