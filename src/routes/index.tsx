import { createFileRoute } from "@tanstack/react-router";

import { ByDay } from "../components/ByDay";
import { ByNight } from "../components/ByNight";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />
				<ByDay />
				<ByNight />
			</main>
			<Footer />
		</>
	);
}
