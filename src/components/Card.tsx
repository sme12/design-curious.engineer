import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

export function Card({
	badge,
	title,
	href,
	cta,
	children,
}: {
	badge: string;
	title: string;
	href?: string;
	cta?: string;
	children: ReactNode;
}) {
	return (
		<article
			className={`relative flex flex-col items-start gap-4 rounded-card border border-line px-6 pt-6 pb-7.5 ${
				href ? "group transition-colors hover:border-paper-muted" : ""
			}`}
		>
			<span className="rounded-badge bg-linear-to-t from-45% from-paper-muted to-50% to-paper px-2 py-1 font-semibold text-caption text-ink">
				{badge}
			</span>
			<h3 className="font-semibold text-accent text-title md:text-title-lg">
				{title}
			</h3>
			<p className="text-body text-paper-muted">{children}</p>
			{href && (
				<span className="flex w-full items-center justify-end gap-2">
					<a
						className="font-semibold text-paper text-small after:absolute after:inset-0 after:rounded-card"
						href={href}
						rel="noreferrer"
						target="_blank"
					>
						{cta}
					</a>
					<ArrowRightIcon
						aria-hidden="true"
						className="text-[#a7a7a7] transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-1"
					/>
				</span>
			)}
		</article>
	);
}
