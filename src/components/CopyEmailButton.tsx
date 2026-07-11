import { useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { copyText } from "../utils/copyText";
import { CopiedToast } from "./CopiedToast";
import { CheckIcon, CopyIcon, EnvelopeIcon } from "./icons";

const EMAIL = "vitalii@sazanov.dev";
const TOAST_DURATION = 2500;

export function CopyEmailButton({ className = "" }: { className?: string }) {
	const [copied, setCopied] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);
	// debug=true also plays web-haptics' audible tick (the haptics.lochie.me sound)
	const haptic = useWebHaptics({ debug: true });

	useEffect(() => () => clearTimeout(toastTimer.current), []);

	const copyEmail = () => {
		copyText(EMAIL);
		setCopied(true);
		haptic.trigger("success");
		setToastVisible(true);
		clearTimeout(toastTimer.current);
		toastTimer.current = setTimeout(
			() => setToastVisible(false),
			TOAST_DURATION,
		);
	};

	return (
		<span className={`relative inline-flex ${className}`}>
			<button
				className="group btn btn-solid gap-1 2xl:text-small-xl"
				onBlur={() => setCopied(false)}
				onClick={copyEmail}
				onMouseLeave={() => setCopied(false)}
				title="Copy email address"
				type="button"
			>
				{EMAIL}
				<span
					aria-hidden="true"
					className="relative hidden md:block text-ink-tertiary"
				>
					<EnvelopeIcon
						className={`size-5 transition-opacity duration-200 ease-out-cubic ${
							copied ? "opacity-0" : "group-hover:opacity-0"
						}`}
					/>
					<CopyIcon
						className={`absolute inset-0 size-5 opacity-0 transition-opacity duration-200 ease-out-cubic ${
							copied ? "" : "group-hover:opacity-100"
						}`}
					/>
					<CheckIcon
						className={`absolute inset-0 size-5 transition-opacity duration-200 ease-out-cubic ${
							copied ? "opacity-100" : "opacity-0"
						}`}
					/>
				</span>
			</button>
			<CopiedToast show={toastVisible} />
		</span>
	);
}
