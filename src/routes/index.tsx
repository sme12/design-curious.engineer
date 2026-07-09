import { createFileRoute } from "@tanstack/react-router";

import { Header } from "../components/Header";
import { Hero } from "../components/Hero";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />
			</main>
		</>
	);
}
