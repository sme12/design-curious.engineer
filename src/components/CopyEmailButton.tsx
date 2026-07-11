import { useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { CheckIcon, CopyIcon, EnvelopeIcon } from "./icons";

const EMAIL = "vitalii@sazanov.dev";

export function CopyEmailButton({ className = "" }: { className?: string }) {
	const [copied, setCopied] = useState(false);
	// debug=true also plays web-haptics' audible tick (the haptics.lochie.me sound)
	const haptic = useWebHaptics({ debug: true });

	const copyEmail = () => {
		void navigator.clipboard.writeText(EMAIL);
		setCopied(true);
		haptic.trigger("success");
	};

	return (
		<button
			className={`group btn btn-solid gap-1 2xl:text-small-xl ${className}`}
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
	);
}
