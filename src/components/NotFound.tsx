import { Link } from "@tanstack/react-router";

import { Header } from "./Header";

export function NotFound() {
	return (
		<>
			<Header />
			<main className="flex min-h-dvh flex-col justify-center bg-(image:--gradient-surface)">
				<div className="mx-auto w-full max-w-content px-gutter py-24 md:px-0 2xl:max-w-content-xl">
					<p className="font-hand font-medium text-[5.5rem] text-gradient-accent leading-none tracking-[-0.04em] md:text-[8rem] 2xl:text-[9rem]">
						404
					</p>
					<p className="mt-6 text-body text-paper-muted 2xl:text-body-xl">
						This page is not there yet.
					</p>
					<p className="mt-6 text-body text-paper-muted 2xl:text-body-xl">
						Vitalii might be working on it, or you
						are just messing with the URL.
					</p>
					<div className="mt-8 md:mt-12.5 2xl:mt-15">
						<Link className="btn btn-solid" to="/">
							Back home
						</Link>
					</div>
				</div>
			</main>
		</>
	);
}
