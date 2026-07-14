# blob.js

This module exports the `NakprcLiquidBlob` class, which renders a simulated 2D physical liquid blob with interactive wave dynamics on an HTML5 Canvas.

## Class: `NakprcLiquidBlob`

### `constructor(el, opts)`
- `el` (HTMLElement): The container element. A canvas will be injected into this element.
- `opts` (Object, optional):
  - `points` (Number): Number of simulation points on the perimeter (default: `64`).
  - `margin` (Number): Margin for the canvas to draw outside the element bounds (default: `50`).
  - `colorA` (String): Gradient start color.
  - `colorB` (String): Gradient end color.
  - `image` (String): URL of an image to render inside the blob.
  - `imageAlpha` (Number): Alpha transparency of the image.

### `poke(px, py, force)`
Applies a physical force to the blob simulation at the specified coordinates `px`, `py`.

### `destroy()`
Cleans up the canvas element, event listeners, resize observers, and stops the animation frame loop.
