import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
} from "react";

// Shared heartbeat for the fun words in a paragraph: while the group is on
// screen, every pulse runs the registered words one after another (document
// order) with a short beat of rest between them — call and response.
const PULSE_EVERY_MS = 6000;
const BEAT = 0.1; // s of stillness between one word ending and the next starting

type Registrant = {
	duration: number; // s the word's own animation takes
	pulse: () => void;
};

const PulseContext = createContext<((r: Registrant) => () => void) | null>(
	null,
);

/**
 * Owns visibility and cadence for the animated words inside it. No pulse on
 * arrival — the first one lands a full interval after scrolling into view —
 * and nothing runs with reduced motion.
 */
export function PulseGroup({ children }: { children: ReactNode }) {
	const wrapRef = useRef<HTMLSpanElement>(null);
	const registrants = useRef<Registrant[]>([]);
	const timeouts = useRef<number[]>([]);

	const register = useCallback((registrant: Registrant) => {
		registrants.current.push(registrant);
		return () => {
			registrants.current = registrants.current.filter(
				(other) => other !== registrant,
			);
		};
	}, []);

	useEffect(() => {
		const wrap = wrapRef.current;
		if (!wrap) {
			return;
		}

		const tick = () => {
			if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
				return;
			}
			let at = 0;
			timeouts.current = registrants.current.map(({ duration, pulse }) => {
				const id = window.setTimeout(pulse, at * 1000);
				at += duration + BEAT;
				return id;
			});
		};

		const clearPending = () => {
			for (const id of timeouts.current) {
				window.clearTimeout(id);
			}
			timeouts.current = [];
		};

		let interval: number | undefined;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				interval = window.setInterval(tick, PULSE_EVERY_MS);
			} else {
				window.clearInterval(interval);
				clearPending();
			}
		});
		observer.observe(wrap);

		return () => {
			observer.disconnect();
			window.clearInterval(interval);
			clearPending();
		};
	}, []);

	return (
		<span ref={wrapRef}>
			<PulseContext.Provider value={register}>{children}</PulseContext.Provider>
		</span>
	);
}

/**
 * Joins the surrounding PulseGroup's heartbeat. `pulse` must be referentially
 * stable (useCallback) and `duration` is how long one run of it takes, so the
 * group knows when to start the next word.
 */
export function usePulse(duration: number, pulse: () => void) {
	const register = useContext(PulseContext);

	useEffect(() => {
		if (!register) {
			return;
		}
		return register({ duration, pulse });
	}, [register, duration, pulse]);
}
