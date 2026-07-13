import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";
import { useCardVideoPreview } from "./useCardVideoPreview";

type BackgroundVideo = {
	src: string;
	poster: string;
};

export function Card({
	badge,
	title,
	href,
	cta,
	backgroundVideo,
	children,
}: {
	badge: string;
	title: string;
	href?: string;
	cta?: string;
	backgroundVideo?: BackgroundVideo;
	children: ReactNode;
}) {
	const {
		cardRef,
		videoRef,
		handlePointerEnter,
		handlePointerLeave,
		handleFocus,
		handleBlur,
	} = useCardVideoPreview(Boolean(backgroundVideo));

	return (
		<article
			ref={cardRef}
			className={`relative flex flex-col items-start gap-4 rounded-card border border-line px-6 pt-6 pb-7.5 2xl:px-8 2xl:pt-8 2xl:pb-9.5 ${
				href ? "group transition-colors hover:border-paper-muted" : ""
			} ${backgroundVideo ? "card-with-background-media overflow-hidden" : ""}`}
			onBlur={handleBlur}
			onFocus={handleFocus}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
		>
			{backgroundVideo ? (
				<div
					aria-hidden="true"
					className="card-background-media pointer-events-none absolute inset-px overflow-hidden rounded-[calc(var(--radius-card)-1px)]"
				>
					<video
						ref={videoRef}
						className="h-full w-full scale-[1.03] object-cover blur-[3px]"
						loop
						muted
						playsInline
						poster={backgroundVideo.poster}
						preload="metadata"
						src={backgroundVideo.src}
					/>
					<div className="absolute inset-0 bg-black/55" />
					<div className="absolute inset-0 bg-(image:--gradient-media-vignette)" />
				</div>
			) : null}
			<span className="z-10 rounded-badge bg-linear-to-t from-45% from-paper-muted to-50% to-paper px-2 py-1 font-semibold text-caption text-ink 2xl:text-caption-xl">
				{badge}
			</span>
			<h3 className="z-10 font-semibold text-accent text-title md:text-title-lg 2xl:text-title-xl">
				{title}
			</h3>
			<p className="z-10 text-body text-paper-muted 2xl:text-body-xl">
				{children}
			</p>
			{href && (
				<span className="z-10 flex w-full items-center justify-end gap-2">
					<a
						className="font-semibold text-paper text-small after:absolute after:inset-0 after:rounded-card 2xl:text-small-xl"
						href={href}
						rel="noreferrer"
						target="_blank"
					>
						{cta}
						<span className="sr-only">
							{` at ${title} (opens in a new tab)`}
						</span>
					</a>
					<ArrowRightIcon
						aria-hidden="true"
						className="text-[#a7a7a7] transition-[color,translate] duration-300 ease-out-cubic group-focus-within:translate-x-1 group-focus-within:text-paper group-hover:translate-x-1 group-hover:text-paper"
					/>
				</span>
			)}
		</article>
	);
}
