import { useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { EMAIL } from "../config/contact";
import { copyText } from "../utils/copyText";

// How long the copied state stays up. Long enough to read a toast, which is
// what the hero's button hangs on it.
const COPIED_DURATION = 2500;

// Shared by the hero's button and the about section's inline one: same address,
// same fallback-aware copy, same window of "that worked" afterwards.
export function useCopyEmail() {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	// Silent by default: web-haptics' `debug` option adds an audible tick, which is
	// a development aid rather than something to ship over a clipboard write.
	const haptic = useWebHaptics();

	useEffect(() => () => clearTimeout(timer.current), []);

	// Nothing to confirm if the copy didn't take — see copyText for when that
	// happens
	const copy = async () => {
		if (!(await copyText(EMAIL))) return;
		setCopied(true);
		haptic.trigger("success");
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), COPIED_DURATION);
	};

	return { copied, copy };
}
