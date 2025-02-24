<script lang="ts">
	import type AnBstore from '$lib/store/AnBstore.svelte';
	import File from './ui/file/File.svelte';
	import Plus from 'lucide-svelte/icons/plus';

	interface Props {
		store: AnBstore;
		onselect: (i: number) => void;
		ondelete: (i: number) => void;
		ondownload: (i: number) => void;
		onrename: (i: number, name: string) => void;
		onnew: () => void;
	}

	let { store, onselect, ondelete, ondownload, onrename, onnew }: Props = $props();

	let is_renaming = $state(-1);
	let inputref: HTMLInputElement | null = $state(null);

	$effect(() => {
		setTimeout(() => {
			console.log('h1it', inputref);
			if (!inputref) return;
			inputref.focus();
			console.log('hit');
		}, 160);
		console.log(inputref);
	});

	function onrenamestart(i: number) {
		is_renaming = i;
		console.log(document.activeElement);
		// (document.activeElement as HTMLElement)?.blur();
	}
	function onrenameend() {
		is_renaming = -1;
	}
</script>

<div>
	{#each store.files.current as file, i}
		<File {onselect} {ondelete} {ondownload} {onrenamestart} id={i}>
			{#if i == is_renaming}
				<!-- svelte-ignore a11y_autofocus -->
				<input
					bind:value={() => store.files.current[is_renaming].name, (v) => onrename(i, v)}
					bind:this={inputref}
					onblur={onrenameend}
					type="text"
					name="file_renaming"
					id="file_renaming"
					class="w-full bg-transparent"
				/>
			{:else if i == store.current.current}
				<span class="text-cyan-500">
					{file.name}
				</span>
			{:else}
				<span>{file.name}</span>
			{/if}
		</File>
	{/each}

	<button class="w-full justify-items-center text-primary/80" onclick={onnew}>
		<Plus size="16" />
	</button>
</div>
