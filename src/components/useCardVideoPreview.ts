import { type FocusEvent, useCallback, useEffect, useRef } from "react";

const HOVER_MEDIA_QUERY = "(hover: hover)";
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

export function useCardVideoPreview(enabled: boolean) {
	const cardRef = useRef<HTMLElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const isInViewport = useRef(false);
	const isPointerOver = useRef(false);
	const isFocusWithin = useRef(false);

	const syncPlayback = useCallback(() => {
		const video = videoRef.current;
		if (!enabled || !video) return;

		const canHover = matchMedia(HOVER_MEDIA_QUERY).matches;
		const prefersReducedMotion = matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches;
		const hasPlaybackIntent =
			!canHover || isPointerOver.current || isFocusWithin.current;

		if (isInViewport.current && hasPlaybackIntent && !prefersReducedMotion) {
			void video.play().catch(() => {
				// The poster remains as a stable fallback if playback is unavailable.
			});
			return;
		}

		video.pause();
	}, [enabled]);

	useEffect(() => {
		const card = cardRef.current;
		if (!enabled || !card) return;

		const hoverQuery = matchMedia(HOVER_MEDIA_QUERY);
		const reducedMotionQuery = matchMedia(REDUCED_MOTION_MEDIA_QUERY);
		const observer = new IntersectionObserver(
			([entry]) => {
				isInViewport.current = entry?.isIntersecting ?? false;
				syncPlayback();
			},
			{ threshold: 0.25 },
		);
		const handleMediaChange = () => syncPlayback();

		observer.observe(card);
		hoverQuery.addEventListener("change", handleMediaChange);
		reducedMotionQuery.addEventListener("change", handleMediaChange);

		return () => {
			observer.disconnect();
			hoverQuery.removeEventListener("change", handleMediaChange);
			reducedMotionQuery.removeEventListener("change", handleMediaChange);
			videoRef.current?.pause();
		};
	}, [enabled, syncPlayback]);

	const handlePointerEnter = useCallback(() => {
		isPointerOver.current = true;
		syncPlayback();
	}, [syncPlayback]);

	const handlePointerLeave = useCallback(() => {
		isPointerOver.current = false;
		syncPlayback();
	}, [syncPlayback]);

	const handleFocus = useCallback(() => {
		isFocusWithin.current = true;
		syncPlayback();
	}, [syncPlayback]);

	const handleBlur = useCallback(
		(event: FocusEvent<HTMLElement>) => {
			if (
				event.relatedTarget instanceof Node &&
				event.currentTarget.contains(event.relatedTarget)
			) {
				return;
			}

			isFocusWithin.current = false;
			syncPlayback();
		},
		[syncPlayback],
	);

	return {
		cardRef,
		videoRef,
		handlePointerEnter,
		handlePointerLeave,
		handleFocus,
		handleBlur,
	};
}
