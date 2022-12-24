<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<h1>SvelteKit Auth</h1>
<p>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
		{/if}
		<p class="signedInText">
			<small>Signed in as</small><br />
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
		</p>
		<button class="btn btn-danger shadow" on:click={() => signOut()}>Sign out</button>
	{:else}
		<p class="notSignedInText">You are not signed in</p>
		<button class="btn btn-dark shadow" on:click={() => signIn('github')}
			>Sign In with GitHub</button
		>
	{/if}
</p>
