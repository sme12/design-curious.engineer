import { animate } from "motion";
import { useCallback, useEffect, useRef } from "react";
import { HandHeading } from "./HandHeading";

export function ByDay() {
	const underlineRef = useRef<HTMLSpanElement>(null);
	const anim = useRef<ReturnType<typeof animate>>(undefined);

	// Hop toward the text, then spring back down with a little overshoot
	const bounceUnderline = useCallback(() => {
		const line = underlineRef.current;
		if (!line || matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		anim.current?.cancel();
		anim.current = animate([
			[line, { y: -2.5 }, { duration: 0.12, ease: "easeOut" }],
			[line, { y: 0 }, { type: "spring", stiffness: 550, damping: 9 }],
		]);
	}, []);

	useEffect(() => () => anim.current?.cancel(), []);

	return (
		<section className="pt-12 pb-15 md:py-section 2xl:py-39">
			<div className="mx-auto max-w-content px-gutter md:grid md:grid-cols-[235px_1fr] md:items-start md:px-0 2xl:max-w-content-xl 2xl:grid-cols-[376px_1fr]">
				<HandHeading>by day</HandHeading>
				<p className="mt-10 text-body md:mt-0 2xl:text-body-xl">
					Lead developer at{" "}
					<a
						className="whitespace-nowrap transition-colors duration-200 ease-out-cubic hover:text-ink-hover"
						href="https://www.kraftvaerk.com/"
						onFocus={bounceUnderline}
						onMouseEnter={bounceUnderline}
						rel="noreferrer"
						target="_blank"
					>
						<img
							alt=""
							className="inline-block size-4.5 rounded-xs align-text-bottom 2xl:size-5 mx-0.5"
							src="/kraftvaerk.png"
						/>{" "}
						<span className="relative inline-block">
							Kraftvaerk
							<span
								aria-hidden="true"
								className="absolute inset-x-0 bottom-0 h-px bg-line"
								ref={underlineRef}
							/>
						</span>
					</a>
					, helping prominent companies across the Nordics{" "}
					<strong className="font-semibold">grow digitally</strong>.
				</p>
			</div>
		</section>
	);
}
