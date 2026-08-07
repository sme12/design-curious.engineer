// One plank of the bookshelf, in CSS 3D — no image, no canvas.
//
// `shelf-slab` is a stack of copies of the same rectangle: eight pushed back
// with translateZ to fake the plank's thickness, then the top face and two
// light passes over it. Tipping the stack on X foreshortens the surface and
// leaves the edge of each buried copy showing as the front lip. Geometry,
// colors and the layer ramp all live in styles.css.
const THICKNESS_LAYERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function ShelfPlank() {
	return (
		<div className="shelf-scene">
			<div className="shelf-cast" />
			<div className="shelf-slab">
				{THICKNESS_LAYERS.map((layer) => (
					<div className={`shelf-layer-${layer}`} key={layer} />
				))}
				<div className="shelf-face" />
				<div className="shelf-sweep" />
				<div className="shelf-sheen" />
			</div>
		</div>
	);
}
