import { useCallback, useRef, useState } from "react";
import { useHandwrittenCaption } from "./useHandwrittenCaption";
import { usePolaroidDevelop } from "./usePolaroidDevelop";
import { usePolaroidShake } from "./usePolaroidShake";
import { usePolaroidTilt } from "./usePolaroidTilt";

const PHOTO_SRC = "/polaroid.jpg";
const CAPTION = "Greetings from Finland";

export function Polaroid({ className = "" }: { className?: string }) {
	const tiltTargetRef = useRef<HTMLDivElement>(null);
	const tiltWrapperRef = useRef<HTMLDivElement>(null);
	const glareRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLElement>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const captionRef = useRef<HTMLElement>(null);

	usePolaroidTilt({
		targetRef: tiltTargetRef,
		wrapperRef: tiltWrapperRef,
		glareRef,
	});
	const shakeCard = usePolaroidShake(cardRef);
	const writeCaption = useHandwrittenCaption(captionRef);
	// The card ignores the cursor while it shakes (see the tilt target below):
	// live tilt updates on top of the shake keyframes stutter both animations
	const [shaking, setShaking] = useState(false);
	const shakeThenWrite = useCallback(() => {
		setShaking(true);
		void shakeCard().then(() => {
			setShaking(false);
			return writeCaption();
		});
	}, [shakeCard, writeCaption]);
	usePolaroidDevelop({
		src: PHOTO_SRC,
		frameRef,
		canvasRef,
		onDevelopStart: shakeThenWrite,
	});

	return (
		<div
			ref={tiltTargetRef}
			className={`group w-fit ${shaking ? "pointer-events-none " : ""}${className}`}
		>
			<div
				ref={tiltWrapperRef}
				className="transition-transform ease-[cubic-bezier(0.34,1.56,0.64,1)]"
				style={{ transitionDuration: "0s" }}
			>
				<figure
					ref={cardRef}
					className="relative flex h-82.25 w-63.5 flex-col rounded-photo-frame bg-paper p-3.5 shadow-polaroid md:h-87 md:w-67.25 2xl:h-104.5 2xl:w-80.75 2xl:rounded-photo-frame-xl 2xl:p-4.25"
				>
					<div
						ref={frameRef}
						className="relative h-60.25 overflow-hidden rounded-photo bg-film md:h-63.75 2xl:h-76.5 2xl:rounded-photo-xl"
					>
						<canvas
							ref={canvasRef}
							aria-label="Polaroid photo"
							className="absolute inset-0 h-full w-full"
							role="img"
						/>
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 rounded-photo inset-shadow-photo 2xl:rounded-photo-xl"
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
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 overflow-hidden rounded-photo-frame opacity-0 mix-blend-overlay transition-opacity duration-300 2xl:rounded-photo-frame-xl motion-safe:group-hover:opacity-100"
					>
						<div
							ref={glareRef}
							className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle,rgba(255,255,255,0.5),rgba(255,255,255,0)_50%)]"
						/>
					</div>
				</figure>
			</div>
		</div>
	);
}
