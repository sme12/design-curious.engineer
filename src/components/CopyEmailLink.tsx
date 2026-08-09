import { EMAIL } from "../config/contact";
import { CheckIcon, CopyIcon } from "./icons";
import { useCopyEmail } from "./useCopyEmail";
import { useUnderlineBounce } from "./useUnderlineBounce";

// The address as it reads in a sentence: a button, since it copies rather than
// goes anywhere, wearing the underline and the hop of the links it sits beside
// so the three ways of getting in touch look like one list.
export function CopyEmailLink({ className = "" }: { className?: string }) {
	const { copied, copy } = useCopyEmail();
	const { bounce, underlineRef } = useUnderlineBounce();

	return (
		<>
			<button
				aria-label={`Copy email address: ${EMAIL}`}
				className={`bouncing-underline-link cursor-pointer whitespace-nowrap transition-colors duration-200 ease-out-cubic hover:text-ink-hover ${className}`}
				onClick={copy}
				onFocus={bounce}
				onMouseEnter={bounce}
				type="button"
			>
				{/* Two icons where the hero's button has three, at the size of the marks
				    the other inline links lead with. The copy glyph is the resting
				    state rather than something a hover reveals: this one sits mid
				    sentence, where an envelope would read as a mailto and where a
				    coarse pointer has no hover to find the real behaviour in. The
				    check takes over once the address has been copied and hands it back
				    after, cross-faded through a blur rather than swapped, so it reads
				    as one icon changing its mind rather than two taking turns. */}
				<span
					aria-hidden="true"
					className="relative mx-0.5 inline-block size-4.5 align-text-bottom 2xl:size-5"
				>
					<CopyIcon
						className={`absolute inset-0 size-full transition-[opacity,filter] duration-200 ease-out-cubic ${
							copied ? "opacity-0 blur-[2px]" : ""
						}`}
					/>
					<CheckIcon
						className={`absolute inset-0 size-full transition-[opacity,filter] duration-200 ease-out-cubic ${
							copied ? "opacity-100" : "opacity-0 blur-[2px]"
						}`}
					/>
				</span>{" "}
				<span className="bouncing-underline-link-label relative inline-block">
					{EMAIL}
					<span
						aria-hidden="true"
						className="absolute inset-x-0 bottom-0 h-px bg-ink-hover"
						ref={underlineRef}
					/>
				</span>
			</button>
			{/* The check is the whole confirmation for anyone looking at it, so
			    someone who isn't gets told in words. Outside the button: a live
			    region inside the thing that was just pressed is announced
			    inconsistently, and this costs no layout. */}
			<output className="sr-only">{copied ? "Email copied" : ""}</output>
		</>
	);
}
