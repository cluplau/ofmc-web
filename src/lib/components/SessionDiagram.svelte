<script lang="ts">
	import { default as mermaid, type MermaidConfig } from 'mermaid';

	let { diagram_text }: { diagram_text: string } = $props();

	let _container: HTMLDivElement;
	$effect(() => {
		const config: MermaidConfig = {
			theme: 'dark',
			startOnLoad: false,
			sequence: { showSequenceNumbers: true }
		};

		mermaid.initialize(config);
	});

	$effect(() => {
		mermaid.render('mermaid', diagram_text).then((result) => {
			_container.innerHTML = result.svg;
		});
	});

	async function renderDiagram() {}
</script>

<div
	id="diagramContainer"
	bind:this={_container}
	class="flex w-full items-center justify-center"
></div>

<style>
	:global(#diagramContainer #mermaid .messageLine0) {
		stroke: #ce9178;
	}
	:global(#diagramContainer #mermaid .messageText) {
		fill: #ce9178;
	}
	:global(#diagramContainer #mermaid #sequencenumber) {
		stroke: #ce9178;
		fill: #ce9178;
	}
	:global(#diagramContainer #mermaid #arrowhead path) {
		stroke: #ce9178;
		fill: #ce9178;
	}

	:global(#diagramContainer #mermaid .actor-line) {
		opacity: 30%;
	}
</style>
