<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import MonacoEditor from '$lib/components/MonacoEditor.svelte';
	import SessionDiagram from '$lib/components/SessionDiagram.svelte';
	import OFMC from '$lib/components/OFMC.svelte';
	import AnBstore from '$lib/store/AnBstore.svelte';
	import OFMCstore from '$lib/store/ofmc.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let store = new AnBstore();
	let ofmc = new OFMCstore();
</script>

<Resizable.PaneGroup direction="horizontal" class="h-full w-full bg-[#1e1e1e] p-2">
	<Resizable.Pane defaultSize={50}>
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane defaultSize={60} class="p-2">
				<section
					class="relative box-border flex h-full w-full overflow-hidden rounded-lg border-2 border-solid border-cyan-800"
				>
					<MonacoEditor bind:value={store.input.current} />

					<Button
						class="absolute bottom-0 right-0 z-10"
						onclick={() => ofmc.run(store.input.current)}>Run</Button
					>
				</section>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane defaultSize={40} class="p-2">
				<section
					class="box-border flex h-full w-full overflow-hidden rounded-lg border-2 border-solid border-cyan-800"
				>
					<SessionDiagram diagram_text={store.diagram_text} />
				</section>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</Resizable.Pane>

	<Resizable.Handle />

	<Resizable.Pane defaultSize={50} class="p-2">
		<section
			class="box-border flex h-full w-full overflow-hidden rounded-lg border-2 border-solid border-cyan-800 p-2"
		>
			{#if ofmc.loading}
				<div class="flex w-full items-center justify-center">
					<span class="loader"></span>
				</div>
			{:else if ofmc.hasRun}
				<OFMC {ofmc}></OFMC>
			{:else}
				<div class="flex w-full items-center justify-center text-gray-100">Press 'Run'</div>
			{/if}
		</section>
	</Resizable.Pane>
</Resizable.PaneGroup>

<style>
	.loader {
		color: #fff;
		font-size: 10px;
		width: 1em;
		height: 1em;
		border-radius: 50%;
		position: relative;
		text-indent: -9999em;
		animation: mulShdSpin 1.3s infinite linear;
		transform: translateZ(0);
	}

	@keyframes mulShdSpin {
		0%,
		100% {
			box-shadow:
				0 -3em 0 0.2em,
				2em -2em 0 0em,
				3em 0 0 -1em,
				2em 2em 0 -1em,
				0 3em 0 -1em,
				-2em 2em 0 -1em,
				-3em 0 0 -1em,
				-2em -2em 0 0;
		}
		12.5% {
			box-shadow:
				0 -3em 0 0,
				2em -2em 0 0.2em,
				3em 0 0 0,
				2em 2em 0 -1em,
				0 3em 0 -1em,
				-2em 2em 0 -1em,
				-3em 0 0 -1em,
				-2em -2em 0 -1em;
		}
		25% {
			box-shadow:
				0 -3em 0 -0.5em,
				2em -2em 0 0,
				3em 0 0 0.2em,
				2em 2em 0 0,
				0 3em 0 -1em,
				-2em 2em 0 -1em,
				-3em 0 0 -1em,
				-2em -2em 0 -1em;
		}
		37.5% {
			box-shadow:
				0 -3em 0 -1em,
				2em -2em 0 -1em,
				3em 0em 0 0,
				2em 2em 0 0.2em,
				0 3em 0 0em,
				-2em 2em 0 -1em,
				-3em 0em 0 -1em,
				-2em -2em 0 -1em;
		}
		50% {
			box-shadow:
				0 -3em 0 -1em,
				2em -2em 0 -1em,
				3em 0 0 -1em,
				2em 2em 0 0em,
				0 3em 0 0.2em,
				-2em 2em 0 0,
				-3em 0em 0 -1em,
				-2em -2em 0 -1em;
		}
		62.5% {
			box-shadow:
				0 -3em 0 -1em,
				2em -2em 0 -1em,
				3em 0 0 -1em,
				2em 2em 0 -1em,
				0 3em 0 0,
				-2em 2em 0 0.2em,
				-3em 0 0 0,
				-2em -2em 0 -1em;
		}
		75% {
			box-shadow:
				0em -3em 0 -1em,
				2em -2em 0 -1em,
				3em 0em 0 -1em,
				2em 2em 0 -1em,
				0 3em 0 -1em,
				-2em 2em 0 0,
				-3em 0em 0 0.2em,
				-2em -2em 0 0;
		}
		87.5% {
			box-shadow:
				0em -3em 0 0,
				2em -2em 0 -1em,
				3em 0 0 -1em,
				2em 2em 0 -1em,
				0 3em 0 -1em,
				-2em 2em 0 0,
				-3em 0em 0 0,
				-2em -2em 0 0.2em;
		}
	}
</style>
