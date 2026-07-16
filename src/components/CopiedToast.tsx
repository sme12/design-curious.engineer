import { CheckIcon } from "./icons";

export function CopiedToast({ show }: { show: boolean }) {
	return (
		<>
			<output className="sr-only">{show ? "Email copied" : ""}</output>
			<span
				aria-hidden="true"
				className={`-translate-x-1/2 absolute bottom-full left-1/2 mb-2 flex w-max items-center gap-1 rounded-pill border border-line bg-surface-deep px-4 py-2.75 font-medium text-paper text-small transition-[opacity,translate,scale] duration-200 ease-out-cubic xs:hidden ${
					show ? "" : "pointer-events-none translate-y-1 scale-96 opacity-0"
				}`}
			>
				<CheckIcon className="size-5" />
				Email copied
			</span>
		</>
	);
}
