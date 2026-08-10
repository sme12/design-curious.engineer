import { Popover } from "@base-ui/react/popover";
import type { ReactNode } from "react";

type PicturePopoverProps = {
	/** Describes the picture. Required with or without one: it is the popup's
	 *  accessible name, and the only version of this a screen reader gets. */
	alt: string;
	children: ReactNode;
	className?: string;
	/** Optional. Without it the window shows undeveloped film — see below. The
	 *  window is square and crops to fill, so square is what to hand it, at
	 *  168px or better: that is three times the 56px it reaches at 2xl. */
	src?: string;
	/** Punctuation that follows the word — the comma after "Lena", the period
	 *  after "Rudy". It comes through here, rather than staying in the prose
	 *  after the closing tag, so that it can be kept on the word's line; see
	 *  the nowrap wrapper below for why it would not stay there on its own. */
	trailing?: string;
};

/**
 * A word in the prose that shows you the thing it names: dotted underline, and
 * a thumbnail polaroid on hover, tap, or Enter.
 *
 * A Popover and not a Tooltip, which is Base UI's own rule — if the trigger
 * exists to open the popup, it is a popover — and the practical difference is
 * touch. Their Tooltip is deliberately dead on touch devices, since there is no
 * way to reveal one before tapping the thing under it; a popover opens on tap,
 * dismisses on Escape and on a tap outside, and takes `openOnHover` to behave
 * like a tooltip for anyone with a pointer. One component, both audiences.
 *
 * Which also makes the trigger a real button rather than a span wearing a
 * tabindex — it does open something, so `aria-expanded` on it is true in both
 * senses.
 */
export function PicturePopover({
	alt,
	children,
	className = "",
	src,
	trailing,
}: PicturePopoverProps) {
	return (
		<Popover.Root>
			{/* Opens the moment the word is touched rather than after the usual
			    settling delay: this is a reward for noticing something, not a
			    warning about it, and a pause would read as the page thinking it
			    over. The close delay is the other half — it covers the gap the
			    cursor crosses between the word and the frame above it, which is
			    8px of nothing that would otherwise flicker the picture out.

			    The arrow stays an arrow over it. A pointing hand is a promise of
			    somewhere to go, and there is nowhere to go — the picture is
			    already showing by the time you could act on it. */}
			{/* The wrapper is what keeps the comma after "Lena" on Lena's line.

			    The trigger is a button holding an inline-block, and a browser is
			    free to break a line at the edge of either the way it breaks at a
			    space. So punctuation pressed against the word gets carried off
			    alone to the next line, at whatever window width lands the break
			    there. A word joiner between the two is the tidier idea and does
			    not work: Chrome breaks at the object boundary regardless.

			    Which is why the mark arrives as a prop. Nothing but a nowrap box
			    drawn around the word and the mark together holds them, and a
			    component can only draw a box around what it is handed. */}
			<span className="whitespace-nowrap">
				<Popover.Trigger
					className={`picture-popover-trigger inline cursor-default whitespace-nowrap transition-colors duration-200 ease-out-cubic hover:text-ink-hover ${className}`}
					closeDelay={150}
					delay={0}
					openOnHover
				>
					<span className="picture-popover-label relative inline-block">
						{children}
						<span
							aria-hidden="true"
							className="picture-popover-underline absolute inset-x-0 bottom-0 h-px"
						/>
					</span>
				</Popover.Trigger>
				{trailing}
			</span>
			<Popover.Portal>
				{/* Above the word and centred on it, with Base UI flipping it below
				    near the top of the viewport. No arrow: a polaroid is an object
				    lying on the page, and a speech-bubble tine would turn it back
				    into a piece of UI. The tilt and the shadow are what tie it to
				    the word. */}
				<Popover.Positioner align="center" side="top" sideOffset={8}>
					{/* The frame. Not the Polaroid component in any part — that one is
					    254px of tilt, shake, canvas development and handwriting, and
					    none of it survives being a thumbnail. What carries the
					    reference at this size is the proportion: the big card's chin
					    is a bit under a third of its picture, so 48px of picture gets
					    15px of paper under it, and the height here is fixed so that
					    the chin is simply what is left over rather than a box of its
					    own to keep in step.

					    Empty, too. A caption would be around 4px of handwriting. */}
					<Popover.Popup className="picture-popover-frame flex h-16.75 w-14 flex-col rounded-photo-frame-mini bg-paper p-1 shadow-polaroid-mini 2xl:h-19.5 2xl:w-16.5 2xl:p-1.25">
						<Popover.Title className="sr-only">{alt}</Popover.Title>
						{/* Undeveloped film until there is a picture: the same
						    opacifier grey-green the big polaroid starts from. A frame
						    that hasn't developed yet is a thing; an empty white
						    rectangle is a bug. */}
						<div className="size-12 overflow-hidden rounded-photo-mini bg-film 2xl:size-14">
							{src && (
								<img
									// The title above says what this is, so the picture is
									// decorative here rather than silent.
									alt=""
									className="h-full w-full object-cover"
									src={src}
								/>
							)}
						</div>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}
