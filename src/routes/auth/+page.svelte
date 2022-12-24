<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<h1 class="display-4">MTG Sorcerer</h1>
<p>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
		{/if}
		<p>
			<small>Signed in as</small><br />
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
		</p>
		<button class="btn btn-danger shadow" on:click={() => signOut()}>Sign out</button>
	{:else}
		<p>You are not signed in. Login to access the web app.</p>
		<button class="btn btn-dark shadow" on:click={() => signIn('github')}
			>Sign In with GitHub</button
		>
	{/if}
</p>
