import { WASI, init, MemFS } from '@wasmer/wasi';

self.onmessage = async function (event) {
	const { fileContent, numSess } = event.data;

	await init();
	const fs = new MemFS();
	const file = fs.open('input.AnB', {
		read: true,
		write: true,
		create: true
	});
	file.writeString(fileContent);

	const wasi = new WASI({
		args: ['ofmc', 'input.AnB', '--numSess', numSess],
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

// usage: ofmc [<OPTIONS>] <INPUT FILE>
// Options:
//   --numSess <INT>  specify the number of sessions (for an AnB spec)
//   --of IF          (for AnB files only:) do not check, but produce AVISPA IF
//   --of Isa         (for AnB files only:) generate a fixedpoint proof for Isabelle-OFMC
//   --of AVANTSSAR   print result in AVANTSSAR Output Format
//   --fp             (for AnB files only:) check with fixedpoint module
//   --classic        (default) run in classic mode
//   -o <outputfile>  write result into <outputfile>
//   --help, -h       display this help
//   --version        display the version
// Options for classic mode:
//   --numSess <INT>              (for AnB files only:) check for a given number of sessions
//   --theory <TheoryFile>        use a custom algebraic theory
//   --exec, -e       checks the executability of each rule (do not search for attacks)
//   --untyped, -u                ignores all type-declarations
//   --depth <DEPTH>, -n <DEPTH>  specify maximum search depth/depth first search
//   --trace <PATH>, -t <PATH>    (PATH is white-space separated list of ints)
//                                specify a path in the search tree to visit
//                                by the indices of the successors to follow.
//   --allin <DEPTH> return every attack state, not counting descendents of attack states.
//   --noowngoal     (for AnB files only:) ignores attacks where an agent talks to itself
//   --IF2CIF        (for AnB files only:) adds a rewriting step from IF/Annotated AnB to cryptIF
//   --attacktrace   If an attack is found, generate a graphic chart of it
