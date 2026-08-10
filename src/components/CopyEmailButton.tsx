import { EMAIL } from "../config/contact";
import { CopiedToast } from "./CopiedToast";
import { CheckIcon, CopyIcon, EnvelopeIcon } from "./icons";
import { useCopyEmail } from "./useCopyEmail";

export function CopyEmailButton({ className = "" }: { className?: string }) {
	const { copied, copy } = useCopyEmail();

	return (
		<span className={`relative inline-flex ${className}`}>
			<button
				aria-label={`Copy email address: ${EMAIL}`}
				className="group btn btn-solid grow gap-1 xs:px-4 xs:pr-3.25 2xl:text-btn-xl"
				onClick={copy}
				type="button"
			>
				{EMAIL}
				<span
					aria-hidden="true"
					className="relative hidden xs:block text-ink-tertiary"
				>
					<EnvelopeIcon
						className={`size-5 transition-[opacity,filter] duration-200 ease-out-cubic pointer-coarse:opacity-0 ${
							copied
								? "opacity-0 blur-[2px]"
								: "group-hover:opacity-0 group-hover:blur-[2px] group-focus-visible:opacity-0 group-focus-visible:blur-[2px]"
						}`}
					/>
					<CopyIcon
						className={`absolute inset-0 size-5 opacity-0 blur-[2px] transition-[opacity,filter] duration-200 ease-out-cubic ${
							copied
								? ""
								: "group-hover:opacity-100 group-hover:blur-none group-focus-visible:opacity-100 group-focus-visible:blur-none pointer-coarse:opacity-100 pointer-coarse:blur-none"
						}`}
					/>
					<CheckIcon
						className={`absolute inset-0 size-5 transition-[opacity,filter] duration-200 ease-out-cubic ${
							copied ? "opacity-100" : "opacity-0 blur-[2px]"
						}`}
					/>
				</span>
			</button>
			<CopiedToast show={copied} />
		</span>
	);
}
