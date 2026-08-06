import { createFileRoute } from "@tanstack/react-router";

import { About } from "../components/About";
import { Bookshelf } from "../components/Bookshelf";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const TITLE = "About — Vitalii Sazanov";
const DESCRIPTION =
	"A bit about Vitalii Sazanov — a design-curious engineer — and what's on his bookshelf.";

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [
			{
				title: TITLE,
			},
			{
				name: "description",
				content: DESCRIPTION,
			},
			{
				property: "og:title",
				content: TITLE,
			},
			{
				property: "og:description",
				content: DESCRIPTION,
			},
		],
	}),
	component: AboutPage,
});

function AboutPage() {
	return (
		<>
			<Header standalone />
			<main>
				<About />
				<Bookshelf />
			</main>
			<Footer />
		</>
	);
}
