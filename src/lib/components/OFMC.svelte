<script lang="ts">
	import type AnBstore from '$lib/store/AnBstore.svelte';
	import OFMCstore from '$lib/store/ofmc.svelte';

	let { ofmc }: { ofmc: OFMCstore } = $props();
</script>

<pre class="w-full overflow-auto text-wrap text-[lightgrey]">
	{#if ofmc.exitCode == 0}
		{ofmc.stdout}
	{:else}
		{ofmc.stderr}
	{/if}
</pre>
