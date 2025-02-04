import { WASI, init, MemFS } from '@wasmer/wasi';

self.onmessage = async function (event) {
	const { fileContent } = event.data;

	await init();
	const fs = new MemFS();
	const file = fs.open('input.AnB', {
		read: true,
		write: true,
		create: true
	});
	file.writeString(fileContent);

	const wasi = new WASI({
		args: ['ofmc', 'input.AnB', '--numSess', '2'],
		env: {},
		fs: fs // Use WasmFs as the file system
	});

	const response = await fetch('/ofmc/ofmc.wasm');
	const module = await WebAssembly.compileStreaming(response);
	await wasi.instantiate(module, {});

	const exitCode = wasi.start();
	const stderr = wasi.getStderrString();
	const stdout = wasi.getStdoutString();

	// Send results back to main thread
	self.postMessage({ exitCode, stdout, stderr });
};
