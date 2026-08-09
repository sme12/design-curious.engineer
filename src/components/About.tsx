import { useRef } from "react";
import { LINKEDIN_URL, X_URL } from "../config/contact";
import { BouncingUnderlineLink } from "./BouncingUnderlineLink";
import { CopyEmailLink } from "./CopyEmailLink";
import { LinkedInIcon, XIcon } from "./icons";
import { useGuitarNote } from "./useGuitarNote";

// Broken into lines by hand: the note is set to its own width out in the page
// margin, and it is handwriting, so where each line ends is part of the look
// rather than something to leave to the box.
const GUITAR_NOTE = [
	"My partner in crime",
	"back in the band days.",
	"Now it's hanging on",
	"the wall in my home",
	"office for music breaks.",
];

export function About() {
	const guitarNoteRef = useRef<HTMLSpanElement>(null);
	const guitarNote = useGuitarNote(guitarNoteRef);

	return (
		<section className="pt-12 pb-15 md:py-section 2xl:py-23">
			{/* One grid, three rows: copy and the frame, then the guitar and more
			    copy, then the last paragraph across the whole measure.

			    Three columns to get two mirrored layouts out of one grid. Each block
			    of copy spans two of them and the picture that isn't beside it takes
			    the third, so the two halves are the same layout flipped.

			    The tracks are the other sections' 235px column, split: a real 76px
			    gap and 159px of picture column left over — 272px and 196px at 2xl.
			    Nothing moves by doing that, since a span across two tracks picks up
			    the gap between them, so the copy still starts and ends where by day,
			    by night and the bookshelf put theirs. What it buys is a gap that is
			    a number rather than whatever a picture happens to leave over — the
			    same on both sides of the section, and about what those sections read
			    as, since the air their headings leave before the text runs 66px to
			    82px depending on how long the heading is. 76px is in the middle of
			    that and doesn't depend on anything.

			    Below md it is one column and the pictures are gone, so the rows are
			    just the paragraphs, and the row gap is their spacing. */}
			<div className="mx-auto grid max-w-content gap-y-6 px-gutter md:grid-cols-[159px_1fr_159px] md:items-start md:gap-x-19 md:px-0 2xl:max-w-content-xl 2xl:grid-cols-[196px_1fr_196px] 2xl:gap-y-8">
				<div className="space-y-6 text-pretty md:col-span-2 2xl:space-y-8">
					<p className="text-body 2xl:text-body-xl">
						Hey! My name is Vitalii (Vitaly, Vitaliy, Виталий). I live in
						Finland with my wife, Lena, and our dog, Rudy.
					</p>
					<p className="text-body 2xl:text-body-xl">
						So, how did I end up making websites for a living? It's a bit of a
						story.
					</p>
					<p className="text-body 2xl:text-body-xl">
						I got into computers early on as a kid, but through the wrong door.
						While everyone around me was either playing games or writing
						"programs," I was tinkering with Photoshop and Macromedia Flash, and
						writing HTML and CSS in Notepad. If you remember the 2000s, you
						probably remember websites full of Flash animations, scrolling
						marquee text, and blinking GIFs everywhere. Those were pretty much
						the kinds of websites I was making at the time.
					</p>
				</div>
				{/* Decorative, and hidden below md: the picture columns are the first
				    thing a phone hasn't got room for.

				    self-stretch is the whole sizing story. The row is as tall as the
				    copy in it — this box has nothing in flow to make it any taller —
				    so stretching hands the frame the text's height, and the aspect
				    ratio in .about-wallpicture turns that into its width. Top edge on
				    the first line, bottom edge on the last, and no size to keep in
				    step with the copy by hand.

				    justify-self-center centres it in its track, and is also what keeps
				    the track from deciding its width: a grid item stretches across its
				    column given the chance, and a stretched width would leave the
				    aspect ratio driving the height instead — which is backwards here,
				    and blows the picture up to the height of a whole page. Since the
				    height is the text's, the width is whatever it comes to, and a
				    frame wider than its track overhangs it evenly on both sides.

				    The picture is out of flow, or its own height would size the row
				    and the row would size it back. Anchored to the bottom, because
				    the box is the frame and the wire above it belongs outside.

				    It takes pointer events, unlike most decoration, because it has a
				    hover — see .about-wallpicture in styles.css. The box is the frame
				    only, but the wire is a child of it and overflows the top, so
				    hovering the wire counts too. */}
				<span className="about-wallpicture hidden md:block md:justify-self-center md:self-stretch">
					<span className="about-wallpicture-cast" />
					<img
						alt=""
						className="absolute bottom-0 left-0 w-full"
						height={649}
						loading="lazy"
						src="/wallpicture.webp"
						width={400}
					/>
				</span>
				{/* Same rules as the frame above, mirrored, with one box more to them.
				    The slot is the grid item now, and it hands the stretch it gets
				    straight on to the guitar — which is sized the way the frame is:
				    the height of the copy beside it, its own proportion turned into a
				    width, and centred rather than stretched across, which for a
				    guitar, being a narrow thing in a track cut for a picture, is a
				    visible amount of air on either side. What the extra box buys is
				    somewhere to hang the margin note, below.

				    The picture is out of flow for the same reason as the frame's, and
				    fills the guitar exactly — this asset is cropped to the instrument
				    with nothing spare, so there is no wire to hang over an edge. The
				    shadow, drawn off a traced silhouette, see .about-guitar-cast,
				    measures itself against that same box — hover included, where both
				    grow.

				    Which means its hover area is the instrument's bounding box, air
				    in the crook of the body and all. Nothing else is near enough for
				    that to be in anybody's way.

				    A figure, unlike the frame above it: the note is a caption in the
				    ordinary sense — a line about the picture, by the picture — and
				    saying so in the markup is what pairs the two for a reader who is
				    getting the picture described rather than looking at it. */}
				<figure className="about-guitar-slot hidden md:grid md:self-stretch">
					{/* biome-ignore lint/a11y/noStaticElementInteractions: the handlers
					   only draw a decoration; the note itself is in the tree below */}
					<span
						className="about-guitar"
						onMouseEnter={guitarNote.show}
						onMouseLeave={guitarNote.hide}
					>
						<span className="about-guitar-cast" />
						<img
							alt="A wine-red Gibson Les Paul electric guitar"
							className="absolute inset-0 w-full"
							height={1193}
							loading="lazy"
							src="/guitar.webp"
							width={400}
						/>
					</span>
					{/* The caption proper. The note is worth reading whether or not it
					    can be hovered into view — and it can't be at all below xl, or
					    without a pointer — so the words live here, in the tree, at every
					    size the picture is; the drawn version below is one presentation
					    of this line and hidden from the tree accordingly.

					    Silent below md, but only because the whole figure is. */}
					<figcaption className="sr-only">{GUITAR_NOTE.join(" ")}</figcaption>
					{/* A sibling of the guitar rather than a child, so the hover's lift
					    and scale leave it alone: this is a couple of hundred pixels of
					    handwriting, and riding a scaled layer would have it resampled
					    for as long as the cursor stayed on the instrument. It reads the
					    hover through the handlers above instead — useGuitarNote for the
					    timing, .about-guitar-note for where it sits and why it waits
					    for xl to sit there. */}
					<span
						ref={guitarNoteRef}
						aria-hidden="true"
						className="about-guitar-note hidden text-ink xl:block"
					>
						{/* Tipped up to the right, the way a line written freehand beside
						    something drifts off the horizontal — the same few degrees the
						    polaroid's caption is off by.

						    On the words and not the whole note, so the arrow keeps the
						    aim it was drawn with: a curve is forgiving of a degree or
						    four, but its tip is the one part of this that has somewhere
						    to be. The wipe that writes each line is unbothered either
						    way, since a mask is cut in the line's own frame and this
						    turns the result. */}
						<span className="-rotate-4 block font-hand font-medium text-body 2xl:text-body-xl">
							{GUITAR_NOTE.map((line) => (
								<span
									key={line}
									className="pen-reveal block w-fit whitespace-nowrap"
									data-line=""
								>
									{line}
								</span>
							))}
						</span>
						{/* Two strokes, in the order a hand would make them: the curve
						    down and across, then the head flicked through the tip from
						    one barb to the other. Each is drawn by walking its dash
						    offset from 1 to 0 — see useGuitarNote — and pathLength
						    normalises both to a length of 1, so that one pair of numbers
						    means the same on a long curve and a short flick alike.

						    The dash state is on the paths and not in the stylesheet
						    because it wants to stay unitless: a bare 1 is a path length
						    here, and Safari mis-scales dash lengths written in px when
						    the page is zoomed. As CSS it wouldn't stay bare — the
						    minifier reads the property as a length and helpfully adds
						    the unit back.

						    The gap is twice the dash rather than equal to it, which
						    matters more than it looks. At an offset of 1 an equal pattern
						    parks the start of the *next* dash exactly on the path's last
						    point, and a zero-length dash under a round cap is drawn as a
						    dot — so the resting state would be a full stop sitting where
						    the arrowhead is about to be, in plain view for as long as the
						    handwriting above takes to reach it. Twice the length puts
						    that boundary past the end of the path, where there is nothing
						    to draw it on. */}
						<svg
							aria-hidden="true"
							className="mt-4 ml-auto block w-24 2xl:w-28"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.4"
							viewBox="0 0 104 62"
						>
							<path
								d="M3 2C3 20 6 33 17 41 31 51 60 49 94 46"
								data-stroke=""
								pathLength="1"
								strokeDasharray="1 2"
								strokeDashoffset="1"
							/>
							<path
								d="M82 41Q88 43 94 46Q89 50 83 53"
								data-stroke=""
								pathLength="1"
								strokeDasharray="1 2"
								strokeDashoffset="1"
							/>
						</svg>
					</span>
				</figure>
				<div className="space-y-6 text-pretty md:col-span-2 md:col-start-2 2xl:space-y-8">
					<p className="text-body 2xl:text-body-xl">
						I didn't take the hobby too seriously, though, because it didn't
						look nearly as cool as what "real" hackers were doing in the movies,
						and kids want to be cool. So eventually, I switched hobbies and
						started a punk band instead. I spent years playing in a band,
						putting most of my creative energy into songwriting and leaving my
						web dev and design passion for occasional updates to the band's
						website.
					</p>
					<p className="text-body 2xl:text-body-xl">
						Then one day, a friend asked if I knew someone who could help build
						a website for his company. I didn't know anyone but myself. A
						company website felt like serious business compared to a band's
						website, so I brushed up on my knowledge with some YouTube courses
						and gave it a shot.
					</p>
				</div>
				{/* The ending and the invitation after it, across the full measure and
				    under both pictures — the story's two halves have had their column
				    each, and these are the lines that put them together. */}
				<p className="text-body text-pretty md:col-span-3 2xl:text-body-xl">
					Somehow, that favor turned into a long-term and, so far, pretty
					successful career in web development. So, after taking a detour
					through punk rock, I ended up pretty close to where I started:
					tinkering with design tools, writing code, and moving pixels around.
					And I've never been happier doing what I love.
				</p>
				<p className="text-body text-pretty md:col-span-3 2xl:text-body-xl">
					If you're also passionate about design and engineering, or think we
					could work together on something cool, feel free to connect with me on{" "}
					<BouncingUnderlineLink
						href={LINKEDIN_URL}
						leading={
							<LinkedInIcon className="mx-0.5 inline-block size-4.5 align-text-bottom 2xl:size-5" />
						}
						rel="noreferrer"
						target="_blank"
					>
						LinkedIn
					</BouncingUnderlineLink>
					,{" "}
					<BouncingUnderlineLink
						href={X_URL}
						leading={
							<XIcon className="mx-0.5 inline-block size-4.5 align-text-bottom 2xl:size-5" />
						}
						rel="noreferrer"
						target="_blank"
					>
						Twitter
					</BouncingUnderlineLink>
					, or via <CopyEmailLink />
				</p>
			</div>
		</section>
	);
}
