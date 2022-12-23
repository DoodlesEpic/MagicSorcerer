<script>
	import '../app.scss';
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
	</div>
</nav>

<main class="container mt-5">
	<slot />
</main>
