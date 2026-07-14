# lens.js

This module exports the `NakprcLiquidLens` class for creating draggable, physics-based magnifying lens effects over elements.

## Class: `NakprcLiquidLens`

### `constructor(el, opts)`
- `el` (HTMLElement): The DOM element to turn into a liquid lens.
- `opts` (Object, optional):
  - `strength` (Number): The strength of the lens distortion.
  - `spring` (Number): Physics spring factor (default: `0.16`).
  - `damping` (Number): Physics damping factor (default: `0.82`).

### `destroy()`
Cleans up event listeners and stops the animation frame loop.

## Usage
Adds a liquid-like stretching and distorting interaction when the element is dragged. Uses CSS custom properties `--nakprc-lens-strength` and `--nakprc-lens-blur` for customization if `opts` are omitted.
