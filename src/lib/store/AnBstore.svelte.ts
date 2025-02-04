interface Action {
	sender: string;
	receiver: string;
	message: string;
}

class AnBstore {
	input: string = $state(default_state);
	agents: string[] = $derived.by(() => {
		const actorsSection = this.input.match(/Types:\n\s*Agent (.*?);/);
		if (!actorsSection) return [];

		return actorsSection[1].split(',').map((actor) => actor.trim());
	});
	actors: string[] = $derived.by(() => {
		return this.agents.filter((agent) => agent === agent.toUpperCase());
	});

	actions: Action[] = $derived.by(() => {
		const actions = [];
		const actionRegex = /([A-Za-z]+)->([A-Za-z]+):\s*(.*)/g;

		let match;
		while ((match = actionRegex.exec(this.input)) !== null) {
			const sender = match[1];
			const receiver = match[2];
			const message = match[3].trim();

			actions.push({ sender, receiver, message });
		}

		return actions;
	});

	diagram_text = $derived.by(() => {
		return (
			'sequenceDiagram\n' +
			this.actors.map((actor) => `actor ${actor}\n`).join('') +
			this.actions
				.map(({ sender, receiver, message }) => `${sender}->>+${receiver}: ${message}\n`)
				.join('')
		);
	});
	exitCode: number = $state(0);
	stderr: string = $state('');
	stdout: string = $state('');
}

export default AnBstore;

const default_state = `Protocol: KeyEx

Types:
  Agent A,B,s;
  Symmetric_key KAB;
  Function sk

Knowledge:
  A: A,B,s,sk(A,s);
  B: A,B,s,sk(B,s);
  s: A,B,s,sk(A,s),sk(B,s)

Actions:
  A->s: A,B
  s->A: {| KAB,B |}sk(A,s), {| KAB,A |}sk(B,s)
  A->B: {| KAB,A |}sk(B,s)
 
Goals: 
  A authenticates s on KAB,B
  B authenticates s on KAB,A
  KAB secret between A,B,s

`;
