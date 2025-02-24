<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import MonacoEditor from '$lib/components/MonacoEditor.svelte';
	import SessionDiagram from '$lib/components/SessionDiagram.svelte';
	import OFMC from '$lib/components/OFMC.svelte';
	import AnBstore, { newFile } from '$lib/store/AnBstore.svelte';
	import OFMCstore from '$lib/store/ofmc.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import FileSystem from '$lib/components/FileSystem.svelte';

	let store = new AnBstore();
	let ofmc = new OFMCstore();

	function onselect(i: number) {
		store.current.current = i;
	}
	function ondelete(i: number) {
		if (i + 1 == store.files.current.length) {
			store.current.current--;
		}
		store.files.current.splice(i, 1);
	}
	function ondownload(i: number) {
		const selected = store.files.current[i];
		let filename = selected.name + '.AnB';
		let blob = new Blob([selected.content], { type: 'text/plain' });

		let a = document.createElement('a');
		a.download = filename;
		a.href = window.URL.createObjectURL(blob);
		a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
	function onrename(i: number, name: string) {
		store.files.current[i].name = name;
	}
	function onnew() {
		store.files.current.push(newFile);
	}
</script>

<Resizable.PaneGroup direction="horizontal" class="h-full w-full bg-[#1e1e1e] p-2">
	<Resizable.Pane defaultSize={50}>
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane defaultSize={60} class="p-2">
				<section
					class="relative box-border flex h-full w-full overflow-hidden rounded-lg border-2 border-solid border-cyan-800"
				>
					<div class="min-w-40 border-r-2 border-solid border-cyan-800">
						<FileSystem {store} {onselect} {ondelete} {onnew} {onrename} {ondownload} />
					</div>

					<div class="contents">
						<MonacoEditor bind:value={store.files.current[store.current.current].content} />

						<Button
							class="absolute bottom-0 right-0 z-10"
							onclick={() => ofmc.run(store.current_input.content)}>Run</Button
						>
					</div>
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
