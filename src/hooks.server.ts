import { SvelteKitAuth } from '@auth/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import GitHub from '@auth/core/providers/github';
import Discord from '@auth/core/providers/discord';
import { Email } from '@auth/core/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	DISCORD_ID,
	DISCORD_SECRET,
	SMTP_USER,
	SMTP_PASSWORD,
	SMTP_HOST,
	SMTP_PORT,
	EMAIL_FROM
} from '$env/static/private';
import clientPromise from './lib/client';

async function authorization({ event, resolve }) {
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
}

export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [
			GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
			Discord({
				clientId: DISCORD_ID,
				clientSecret: DISCORD_SECRET
			}),
			Email({
				server: {
					host: SMTP_HOST,
					port: Number(SMTP_PORT),
					auth: {
						user: SMTP_USER,
						pass: SMTP_PASSWORD
					}
				},
				from: EMAIL_FROM
			})
		],
		adapter: MongoDBAdapter(clientPromise)
	}),
	authorization
);
