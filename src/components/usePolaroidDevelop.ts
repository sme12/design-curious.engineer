import { type RefObject, useEffect } from "react";

// Develop-animation knobs
const DURATION = 4000; // ms of chemistry
const START_DELAY = 600; // ms of blank card before it kicks in
const DEVELOPER = [185, 191, 180]; // milky blank-film color (--color-film)

// Fast chemical start, long gentle finish
const ease = (x: number) => 1 - (1 - x) ** 2.6;

/**
 * Runs the polaroid "develop" animation: once the photo is loaded and the
 * frame scrolls into view, the canvas develops from a milky blank into the
 * photo. Calls `onDevelopStart` as the sequence kicks off and `onDeveloped`
 * when the photo is fully developed (immediately with reduced motion).
 */
export function usePolaroidDevelop({
	src,
	frameRef,
	canvasRef,
	onDevelopStart,
	onDeveloped,
}: {
	src: string;
	frameRef: RefObject<HTMLDivElement | null>;
	canvasRef: RefObject<HTMLCanvasElement | null>;
	onDevelopStart?: () => void;
	onDeveloped: () => void;
}) {
	useEffect(() => {
		const frame = frameRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!frame || !canvas || !ctx) return;

		let raf = 0;
		let start: number | undefined;
		let done = false;
		let disposed = false;

		const fitCanvas = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const rect = canvas.getBoundingClientRect();
			canvas.width = Math.round(rect.width * dpr);
			canvas.height = Math.round(rect.height * dpr);
		};

		const img = new Image();

		const draw = (t: number) => {
			const w = canvas.width;
			const h = canvas.height;

			// 1 · the photo, filtered like undeveloped film, cover-cropped to the frame
			const blur = (1 - t) * 0.014 * w; // soft → sharp
			const bright = 1.9 - 0.9 * t; // washed out → true
			const contrast = 0.15 + 0.85 * t; // flat → full
			const saturate = t * t; // grey → color (late)
			const hue = -28 * (1 - t); // cold green-cyan cast → neutral
			ctx.filter =
				`blur(${blur}px) brightness(${bright}) ` +
				`contrast(${contrast}) saturate(${saturate}) hue-rotate(${hue}deg)`;
			const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
			const sw = w / scale;
			const sh = h / scale;
			ctx.drawImage(
				img,
				(img.naturalWidth - sw) / 2,
				(img.naturalHeight - sh) / 2,
				sw,
				sh,
				0,
				0,
				w,
				h,
			);
			ctx.filter = "none";

			// 2 · milky developer layer dissolving away; the low exponent lets a
			// ghost of the image surface under the veil early, like real film
			const milk = (1 - t) ** 1.3;
			if (milk > 0.003) {
				ctx.fillStyle = `rgba(${DEVELOPER.join(",")},${milk})`;
				ctx.fillRect(0, 0, w, h);
			}

			// 3 · faint chemical grain while developing, gone when done
			const grain = (1 - t) * 0.1;
			if (grain > 0.01) {
				ctx.globalAlpha = grain;
				for (let i = 0; i < 240; i++) {
					const g = Math.floor(120 + Math.random() * 135);
					ctx.fillStyle = `rgb(${g},${g},${g - 10})`;
					ctx.fillRect(
						Math.random() * w,
						Math.random() * h,
						1 + Math.random() * 2,
						1 + Math.random() * 2,
					);
				}
				ctx.globalAlpha = 1;
			}
		};

		const loop = (now: number) => {
			start ??= now;
			const x = Math.min(Math.max(now - start - START_DELAY, 0) / DURATION, 1);
			draw(ease(x));
			if (x < 1) {
				raf = requestAnimationFrame(loop);
			} else {
				done = true;
				onDeveloped();
			}
		};

		const develop = () => {
			fitCanvas();
			onDevelopStart?.();
			if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
				done = true;
				draw(1);
				onDeveloped();
				return;
			}
			raf = requestAnimationFrame(loop);
		};

		const loaded = new Promise<void>((resolve) => {
			img.onload = () => resolve();
			img.fetchPriority = "high"; // matches the preload in the route head
			img.src = src;
		});

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					observer.disconnect();
					void Promise.all([loaded, document.fonts.ready]).then(() => {
						if (!disposed) develop();
					});
				}
			},
			{ threshold: 0.4 },
		);
		observer.observe(frame);

		const resizeObserver = new ResizeObserver(() => {
			fitCanvas();
			if (done) draw(1);
		});
		resizeObserver.observe(frame);

		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			observer.disconnect();
			resizeObserver.disconnect();
		};
	}, [src, frameRef, canvasRef, onDevelopStart, onDeveloped]);
}
