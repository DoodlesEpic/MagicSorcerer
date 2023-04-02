import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Discord from '@auth/core/providers/discord';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Provider } from '@auth/core/providers';

const authorization: Handle = async function ({ event, resolve }) {
	// Protect any routes under /app
	if (event.url.pathname.startsWith('/app')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/auth');
		}
	}

	// If the request is still here, just proceed as normally
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html
	});
	return result;
};

const githubProvider = GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }) as Provider;
const discordProvider = Discord({
	clientId: DISCORD_ID,
	clientSecret: DISCORD_SECRET
}) as Provider;

export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [githubProvider, discordProvider]
	}),
	authorization
);
