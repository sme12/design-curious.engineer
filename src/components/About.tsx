export function About() {
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
						Finland with my wife Lena, and our dog, Rudy.
					</p>
					<p className="text-body 2xl:text-body-xl">
						I got into computers early on as a kid, but through the wrong door.
						While everyone around me was either playing games or writing
						"programs," I was tinkering with Photoshop and Macromedia Flash, and
						writing HTML and CSS in Notepad. If you remember the early 00s, you
						probably remember websites full of creative Flash animations,
						scrolling marquee text, and blinking GIFs everywhere. Those were
						pretty much the kinds of websites I was making at the time.
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
				{/* Same rules as the frame above, mirrored: stretched to the height of
				    the copy beside it, sized across by its own proportion, and centred
				    in its track — which for a guitar, being a narrow thing in a track
				    cut for a picture, is a visible amount of air on either side.

				    The picture is out of flow for the same reason, and fills the box
				    exactly — this asset is cropped to the instrument with nothing
				    spare, so there is no wire to hang over an edge. The shadow, drawn
				    off a traced silhouette, see .about-guitar-cast, measures itself
				    against that same box — hover included, where both grow.

				    Which means its hover area is the instrument's bounding box, air
				    in the crook of the body and all. Nothing else is near enough for
				    that to be in anybody's way. */}
				<span className="about-guitar hidden md:block md:justify-self-center md:self-stretch">
					<span className="about-guitar-cast" />
					<img
						alt=""
						className="absolute inset-0 w-full"
						height={1193}
						loading="lazy"
						src="/guitar.webp"
						width={400}
					/>
				</span>
				<div className="space-y-6 text-pretty md:col-span-2 md:col-start-2 2xl:space-y-8">
					<p className="text-body 2xl:text-body-xl">
						I didn't take the hobby too seriously, though, because it didn't
						look nearly as cool as what "real" hackers were doing in the movies,
						and kids want to be cool. So eventually, I switched hobbies and
						started a punk band instead. I spent 10 years playing in a band,
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
				{/* The ending, across the full measure and under both pictures — the
				    story's two halves have had their column each, and this is the line
				    that puts them together. */}
				<p className="text-body text-pretty md:col-span-3 2xl:text-body-xl">
					Somehow, that favor turned into a long-term career in frontend
					development. So, after taking a ten-year detour through punk rock, I
					ended up pretty close to where I started: sitting in front of a
					computer, moving pixels around, and trying to make websites better.
				</p>
			</div>
		</section>
	);
}
