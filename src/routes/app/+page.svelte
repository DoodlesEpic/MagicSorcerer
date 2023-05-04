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
		<li>Davinci: The most capable GPT3 model which can be finetuned.</li>
		<li>Davinci 2: A GPT3.5 model that has been trained with supervised fine-tuning.</li>
		<li>
			Davinci 3: The same GPT3.5 model but trained with reinforcement learning. Generally more
			capable.
		</li>
		<li>
			GPT 3.5 Turbo: A state-of-the-art language model that can generate human-like text and powers
			ChatGPT.
		</li>
	</ul>
</section>
<section class="mb-3">
	<form method="POST" id="form" use:enhance>
		<div class="row mb-3">
			<div class="col">
				<label class="form-label" for="model">Model:</label>
				<select class="form-select" id="model" name="model">
					<option selected value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
					<option value="text-davinci-003">Davinci 3</option>
					<option value="text-davinci-002">Davinci 2</option>
					<option value="davinci">Davinci</option>
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
