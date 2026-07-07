import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<main className="flex min-h-dvh flex-col items-start justify-center gap-6 bg-(image:--gradient-surface) px-gutter text-paper">
			<h1 className="max-w-content text-display md:text-display-lg">
				Hi, I'm Vitalii —<br />a design-
				<span className="font-hand text-gradient-accent">curious</span> engineer
			</h1>
			<p className="text-body text-paper-muted">
				This page is still in the darkroom. Greetings from Finland!
			</p>
		</main>
	);
}
