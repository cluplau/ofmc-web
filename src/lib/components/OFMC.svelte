<script lang="ts">
	import { init, WASI } from '@wasmer/wasi';

	let { exitCode, stdout, stderr } = $props();

	async function runWasm() {
		await init();

		let wasi = new WASI({
			args: []
		});

		// Load WASM file
		const moduleBytes = await fetch('ofmc/ofmc.wasm');
		const module = await WebAssembly.compileStreaming(moduleBytes);
		await wasi.instantiate(module, {});
		exitCode = wasi.start();
		stdout = wasi.getStdoutString();
		stderr = wasi.getStderrString();

		// console.log(`${stdout}(exit code: ${exitCode})`);
		// console.log(`${stderr}(exit code: ${exitCode})`);
	}

	runWasm();
</script>

<pre class="overflow-auto text-wrap text-[lightgrey]">
	{#if exitCode == 0}
		{stdout}
	{:else}
		{stderr}
	{/if}
</pre>
