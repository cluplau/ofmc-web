import WasmWorker from './wasmWorker?worker';

class OFMCstore {
	hasRun = $state(false);
	loading = $state(false);
	exitCode = $state(0);
	stdout = $state('');
	stderr = $state('');

	async run(fileContent: string) {
		this.loading = true;
		const worker = new WasmWorker();
		worker.postMessage({ fileContent });

		worker.onmessage = (event) => {
			const { exitCode, stdout, stderr } = event.data;
			this.exitCode = exitCode;
			this.stdout = stdout;
			this.stderr = stderr;
			this.loading = false;
			this.hasRun = true;
		};

		worker.onerror = (error) => {
			console.error('WASM Worker Error:', error);
			this.loading = false;
			this.hasRun = true;
		};
	}
}

export default OFMCstore;
