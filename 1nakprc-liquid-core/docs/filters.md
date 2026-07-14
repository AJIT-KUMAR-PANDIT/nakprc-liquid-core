# filters.js

This module manages SVG displacement map filters and bump maps used to create liquid distortion optical effects.

## API

### `nakprcEnsureFilter(id, strength)`
Creates an SVG filter with the given `id` and displacement `strength`, appending it to a hidden SVG element in the document body. Generates and uses a custom radial bump map if one has not yet been created.

### `getNextLensCount()`
Returns an incremented counter used to generate unique IDs for lenses that have a custom distortion strength.
