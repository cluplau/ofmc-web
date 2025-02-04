<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import MonacoEditor from '$lib/components/MonacoEditor.svelte';
	import SessionDiagram from '$lib/components/SessionDiagram.svelte';
	import OFMC from '$lib/components/OFMC.svelte';
	import AnBstore from '$lib/store/AnBstore.svelte';

	let store = new AnBstore();

	$inspect(store.agents);
	$inspect(store.actors);
	$inspect(store.diagram_text);
	$inspect(store.actions);
</script>

<!-- 
<div class="flex h-full w-full gap-4 bg-[#1e1e1e] p-4">
	<div class="flex w-full max-w-2xl flex-col gap-4">
		<section
			class="flex w-full grow resize-y flex-col overflow-hidden rounded-lg border-2 border-solid border-cyan-800"
		></section>

		<section
			class="flex w-full grow flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-cyan-800 p-4"
		>
			<SessionDiagram diagram_text={store.diagram_text} />
		</section>
	</div>

	<section
		class="flex grow resize-x flex-col overflow-hidden rounded-lg border-2 border-solid border-cyan-800 p-4"
	>
		<OFMC exitCode={store.exitCode} stdout={store.stdout} stderr={store.stderr}></OFMC>
	</section>
</div> -->

<Resizable.PaneGroup direction="horizontal" class="h-full w-full bg-[#1e1e1e] p-2">
	<Resizable.Pane defaultSize={50}>
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane defaultSize={60} class="p-2">
				<section
					class="box-border flex h-full w-full overflow-hidden rounded-lg border-2 border-solid border-cyan-800"
				>
					<MonacoEditor bind:value={store.input} language="yaml" />
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
			<OFMC exitCode={store.exitCode} stdout={store.stdout} stderr={store.stderr}></OFMC>
		</section>
	</Resizable.Pane>
</Resizable.PaneGroup>
