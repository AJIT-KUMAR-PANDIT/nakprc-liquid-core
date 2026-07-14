# init.js

This module provides a helper function to automatically discover and initialize Nakprc Liquid Core components based on DOM classes.

## API

### `initNakprcDOM()`
Scans the document for elements with specific classes and initializes their corresponding physics controllers:
- `.nakprc-liquid-glass` -> Initializes a `NakprcLiquidBlob`
- `.nakprc-liquid-lens` -> Initializes a `NakprcLiquidLens`

Ensures components are only initialized once per element.
