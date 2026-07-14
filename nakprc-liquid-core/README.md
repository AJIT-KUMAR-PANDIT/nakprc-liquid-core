# Nakprc Liquid Core

A lightweight, physics-based liquid UI component library. 

## Installation

```bash
npm install nakprc-liquid-core
```

## Setup

In your application root (e.g., `index.js` or `App.jsx`), initialize the library once. It will automatically watch your DOM for any newly added components:

```javascript
import { initNakprcDOM } from 'nakprc-liquid-core';

initNakprcDOM();
```

## Interactivity & Motion Sync

- **Draggable Components**: Elements using `LIQUID_LENS` are draggable *only* if they have the ID `draggable` (or `dragable`) or the class `nakprc-liquid-draggable`. 
- **Parallax Sync**: Any `LIQUID_IMG` or `LIQUID_TEXT` child elements inside a `LIQUID_GLASS` (blob) or `LIQUID_LENS` will automatically translate and skew in sync with the fluid's physical motions when hovered or poked.

## Component Usage

You can import the class name constants directly into your components. Because `initNakprcDOM()` is watching the DOM, they will instantly work the moment they are rendered!

```jsx
import { 
  LIQUID_GLASS, 
  LIQUID_LENS, 
  LIQUID_IMG, 
  LIQUID_TEXT 
} from 'nakprc-liquid-core';

export function MyLiquidComponent() {
  return (
    <div className={`${LIQUID_GLASS} ${LIQUID_LENS} w-full h-full min-h-[300px]`}>
      
      {/* This image will skew and warp with the fluid */}
      <img src="photo.jpg" className={LIQUID_IMG} />

      {/* This text will skew and warp with the fluid */}
      <h1 className={LIQUID_TEXT}>Liquid UI</h1>

    </div>
  );
}
```
