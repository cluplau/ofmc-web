import WasmWorker from './wasmWorker?worker';

interface OFMCOutput {
	input: string;
	summary: string;
	goal: string;
	details?: string;
	backend: string;
	statistics: string;
	attack_trace?: string;
}

class OFMCstore {
	hasRun = $state(false);
	loading = $state(false);
	exitCode = $state(0);
	stdout = $state('');
	stderr = $state('');
	parsed_out: OFMCOutput = $state({
		input: '',
		summary: '',
		goal: '',
		details: '',
		backend: '',
		statistics: '',
		attack_trace: ''
	});

	async run(fileContent: string) {
		this.loading = true;
		const worker = new WasmWorker();
		worker.postMessage({ fileContent, numSess: '2' });

		worker.onmessage = (event) => {
			const { exitCode, stdout, stderr } = event.data;
			this.exitCode = exitCode;
			this.stdout = stdout;
			this.stderr = stderr;
			this.loading = false;
			this.hasRun = true;

			this.parse_out(exitCode == 0 ? stdout : stderr);
			console.log(this.parsed_out);
		};

		worker.onerror = (error) => {
			console.error('WASM Worker Error:', error);
			this.loading = false;
			this.hasRun = true;
		};
	}

	parse_out(input: string) {
		const lines = input.trim().split('\n');

		let currentSection = null;

		for (const line of lines) {
			if (line.startsWith('INPUT:')) {
				currentSection = 'input';
				this.parsed_out.input = line.substring(6).trim();
			} else if (line.startsWith('SUMMARY:')) {
				currentSection = 'summary';
				this.parsed_out.summary = line.substring(8).trim();
			} else if (line.startsWith('GOAL:')) {
				currentSection = 'goal';
				this.parsed_out.goal = line.substring(6).trim();
			} else if (line.startsWith('DETAILS:')) {
				currentSection = 'details';
				this.parsed_out.details = line.substring(8).trim();
			} else if (line.startsWith('BACKEND:')) {
				currentSection = 'backend';
				this.parsed_out.backend = line.substring(8).trim();
			} else if (line.startsWith('STATISTICS:')) {
				currentSection = 'statistics';
				this.parsed_out.statistics = line.substring(12).trim();
			} else if (line.startsWith('ATTACK TRACE:')) {
				currentSection = 'attack_trace';
				this.parsed_out.attack_trace = line.substring(13).trim();
			} else if (line.startsWith('% Reached State:')) {
				break;
			} else if (currentSection != null) {
				this.parsed_out[currentSection as keyof OFMCOutput] += `${line}\n`;
			}
		}
	}
}

export default OFMCstore;
