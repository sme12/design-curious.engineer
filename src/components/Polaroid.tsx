import { useCallback, useRef } from "react";
import { useHandwrittenCaption } from "./useHandwrittenCaption";
import { usePolaroidDevelop } from "./usePolaroidDevelop";
import { usePolaroidShake } from "./usePolaroidShake";

const PHOTO_SRC = "/polaroid.jpg";
const CAPTION = "Greetings from Finland";

export function Polaroid({ className = "" }: { className?: string }) {
	const cardRef = useRef<HTMLElement>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const captionRef = useRef<HTMLElement>(null);

	const shakeCard = usePolaroidShake(cardRef);
	const writeCaption = useHandwrittenCaption(captionRef);
	const shakeThenWrite = useCallback(
		() => void shakeCard().then(writeCaption),
		[shakeCard, writeCaption],
	);
	usePolaroidDevelop({
		src: PHOTO_SRC,
		frameRef,
		canvasRef,
		onDevelopStart: shakeThenWrite,
	});

	return (
		<figure
			ref={cardRef}
			className={`flex h-82.25 w-63.5 flex-col rounded-photo bg-paper p-3.5 shadow-polaroid md:h-87 md:w-67.25 2xl:h-104.5 2xl:w-80.75 2xl:p-4.25 ${className}`}
		>
			<div
				ref={frameRef}
				className="relative h-60.25 overflow-hidden rounded-photo bg-film md:h-63.75 2xl:h-76.5"
			>
				<canvas
					ref={canvasRef}
					aria-label="Polaroid photo"
					className="absolute inset-0 h-full w-full"
					role="img"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 rounded-photo inset-shadow-photo"
				/>
				<noscript>
					<style>{"[data-word] { --p: 125%; }"}</style>
					<img
						alt=""
						className="absolute inset-0 h-full w-full object-cover"
						src={PHOTO_SRC}
					/>
				</noscript>
			</div>
			<figcaption
				ref={captionRef}
				className="flex flex-1 items-center justify-center"
			>
				<span className="sr-only">{CAPTION}</span>
				<span
					aria-hidden="true"
					className="-rotate-4 font-hand font-medium text-body md:rotate-0 md:italic 2xl:text-body-xl"
				>
					{CAPTION.split(" ").map((word, index) => (
						<span key={word}>
							{index > 0 && " "}
							<span
								className="pen-reveal inline-block text-gradient-pencil"
								data-word=""
							>
								{word}
							</span>
						</span>
					))}
				</span>
			</figcaption>
		</figure>
	);
}
