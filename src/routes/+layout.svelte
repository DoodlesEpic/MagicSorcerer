<script>
	import '../app.scss';
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>MTG Sorcerer</title>
	<meta
		name="description"
		content="Find powerful MTG card suggestions from AI with MTG Sorcerer. Utilizing advanced machine learning algorithms, our AI helps you improve your Magic: The Gathering deck. Try it out now!"
	/>
</svelte:head>

<nav class="navbar sticky-top bg-body shadow-sm">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">MTG Sorcerer</a>
		{#if $page.data.session}
			<button class="btn btn-danger shadow" on:click={() => signOut()}>Sign out</button>
		{:else}
			<a href="/auth" class="btn btn-primary shadow">Sign In</a>
		{/if}
	</div>
</nav>

<main class="container mt-5">
	<slot />
</main>
