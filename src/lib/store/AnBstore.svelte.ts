import { localState } from '@sv-use/core';

interface Action {
	sender: string;
	receiver: string;
	message: string;
}

class AnBstore {
	input = localState('anb_input', default_state);
	agents: string[] = $derived.by(() => {
		const actorsSection = this.input.current.match(/Types:\n\s*Agent (.*?);/);
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
		while ((match = actionRegex.exec(this.input.current)) !== null) {
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
  Agent B,A,s;
  Number NA,NB;
  Symmetric_key KAB;
  Function sk,pre

Knowledge:
  A: A,B,s,sk(A,s),pre;
  B: A,B,s,sk(B,s),pre;
  s: A,B,s,sk(A,s),sk(B,s),pre
  where A!=B

Actions:
  B->A: A,B,NB
  A->s: A,B,NA,NB
  s->A: {| KAB,A,B,NA |}sk(A,s), {| KAB,A,B,NB |}sk(B,s)
  A->B: {| KAB,A,B,NB |}sk(B,s)
 
Goals: 
  A authenticates s on KAB,B
  B authenticates s on KAB,A
  KAB secret between A,B,s
`;
