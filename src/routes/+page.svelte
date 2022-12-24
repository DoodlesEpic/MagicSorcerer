<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<section class="mb-3">
	<p>
		Welcome to Magic the Gathering Sorcerer. The website uses AI to provide suggestions to help you
		improve your Magic: The Gathering decklists. Whether you're a seasoned pro or a newcomer to the
		game, our AI can help you identify combos, understand your deck's strengths and weaknesses, and
		make informed decisions about which cards to add or remove. Our user-friendly interface and
		accessible language make it easy for any Magic player to benefit from our AI's expert insights.
	</p>
	<ul>
		<li>Ada: A state-of-the-art language model that can generate human-like text.</li>
		<li>
			Babbage: A language model that can answer questions and provide information on a wide range of
			topics.
		</li>
		<li>
			Curie: A language model that can generate text with a sense of curiosity and playfulness.
		</li>
		<li>Davinci: A language model that can perform translation and summarization tasks.</li>
	</ul>
</section>
<section class="mb-3">
	<form method="POST" id="form" use:enhance>
		<div class="row mb-3">
			<div class="col">
				<label class="form-label" for="model">Model:</label>
				<select class="form-select" id="model" name="model">
					<option selected value="text-davinci-003">Davinci</option>
					<option value="text-curie-001">Curie</option>
					<option value="text-babbage-001">Babbage</option>
					<option disabled value="ada">Ada</option>
				</select>
			</div>
			<div class="col">
				<label class="form-label" for="format">Game format:</label>
				<select class="form-select" id="format" name="format">
					<option selected value="commander">Commander</option>
					<option value="standard">Standard</option>
					<option value="modern">Modern</option>
					<option value="historic">Historic</option>
				</select>
			</div>
		</div>

		<div class="mb-3">
			<label class="form-label" for="decklist">Decklist:</label>
			<textarea class="form-control" id="decklist" name="decklist" rows="10" />
		</div>

		<button class="btn btn-primary" type="submit">Generate response</button>
	</form>
</section>

<section class="mb-3" id="response" style="white-space: pre-wrap; font-family: inherit">
	{#if form?.completion}
		<p>{form?.completion}</p>
	{/if}
	{#if form?.error}
		<p>{form?.error}</p>
	{/if}
</section>
