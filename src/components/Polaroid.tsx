export function Polaroid({ className = "" }: { className?: string }) {
	return (
		<figure
			className={`flex h-82.25 w-63.5 flex-col rounded-photo bg-paper p-3.5 shadow-polaroid md:h-87 md:w-67.25 ${className}`}
		>
			<div className="h-60.25 rounded-photo bg-paper-muted inset-shadow-photo md:h-63.75" />
			<figcaption className="flex flex-1 items-center justify-center">
				<span className="-rotate-4 font-hand font-medium text-body text-gradient-pencil md:rotate-0 md:italic">
					Greetings from Finland
				</span>
			</figcaption>
		</figure>
	);
}
