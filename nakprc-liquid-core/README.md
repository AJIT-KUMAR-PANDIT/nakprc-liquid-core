# Nakprc Liquid Core

`nakprc-liquid-core` is a lightweight, physics-based liquid UI component library. It provides stunning liquid glass, refraction optics, drag mechanics, and hover/poke blob effects for modern web applications.

## Installation

```bash
npm install nakprc-liquid-core
```

## Quick Start (Vanilla JS)

The easiest way to get started is to use the `initNakprcDOM` function. This will automatically scan your DOM for specific classes and initialize the physical liquid effects.

```javascript
import { initNakprcDOM } from 'nakprc-liquid-core';

// Initialize all liquid components in the DOM
document.addEventListener('DOMContentLoaded', () => {
  initNakprcDOM();
});
```

## Components

The library relies on three main CSS classes to construct the physical UI elements:

- `nakprc-liquid-glass`: Adds the physical blob (wobble, hover bulge, poke) boundary.
- `nakprc-liquid-lens`: Adds the optical refraction (light bending) and drag mechanics.
- `nakprc-liquid-label`: A styled text component meant to sit on top of liquid surfaces.

### 1. Liquid Button (Glass Physics Only)

Use `nakprc-liquid-glass` to create a liquid surface that bulges when hovered and wobbles when poked.

```html
<button 
  class="nakprc-liquid-glass" 
  style="--nakprc-radius: 32px; width: 200px; height: 64px;"
  data-color-a="rgba(59, 130, 246, 0.8)" 
  data-color-b="rgba(37, 99, 235, 0.9)">
  <span class="nakprc-liquid-label">
    Hover & Poke
  </span>
</button>
```

### 2. The Ultimate Card (Glass + Lens Refraction + Drag)

Combine `nakprc-liquid-glass` and `nakprc-liquid-lens` to create a draggable card that refracts background elements while wobbling at the edges.

```html
<div 
  class="nakprc-liquid-glass nakprc-liquid-lens" 
  style="--nakprc-radius: 40px; --nakprc-lens-strength: 60; --nakprc-lens-blur: 4px; width: 256px; height: 320px;"
  data-color-a="rgba(255, 255, 255, 0.15)" 
  data-color-b="rgba(255, 255, 255, 0.05)">
  <span class="nakprc-liquid-label flex-col gap-1 text-center border border-white/20">
    <span class="block font-bold text-lg">Drag Me</span>
    <span class="block text-xs font-normal opacity-80">I bend light & bounce</span>
  </span>
</div>
```

### 3. Liquid Avatar (Circular Lens)

Create perfectly circular liquid drops by adjusting the radius.

```html
<div 
  class="nakprc-liquid-glass nakprc-liquid-lens rounded-full" 
  style="--nakprc-radius: 100px; --nakprc-lens-blur: 1px; width: 128px; height: 128px;"
  data-color-a="rgba(16, 185, 129, 0.4)" 
  data-color-b="rgba(5, 150, 105, 0.2)">
  <span class="nakprc-liquid-label bg-black/40">User</span>
</div>
```

### 4. Liquid Image (Image inside Blob)

You can render an image directly *inside* the physics-driven liquid blob using `data-image` and `data-image-alpha`. This makes the photo itself wobble and refract.

```html
<div 
  class="nakprc-liquid-glass nakprc-liquid-lens shadow-2xl" 
  style="--nakprc-radius: 40px; --nakprc-lens-strength: 55; --nakprc-lens-blur: 2px; width: 192px; height: 192px;"
  data-image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop"
  data-image-alpha="0.75"
  data-color-a="rgba(59, 130, 246, 0.3)" 
  data-color-b="rgba(147, 51, 234, 0.3)">
  <span class="nakprc-liquid-label border border-white/20 backdrop-blur-md">Fluid Photo</span>
</div>
```

## Advanced API Configuration

If you prefer not to use `initNakprcDOM()`, you can initialize the classes manually for full control.

```javascript
import { NakprcLiquidBlob, NakprcLiquidLens } from 'nakprc-liquid-core';

const el = document.getElementById('my-element');

// Initialize Blob (Hover/Poke)
const blob = new NakprcLiquidBlob(el, {
  points: 64,
  margin: 50,
  colorA: 'rgba(59, 130, 246, 0.8)',
  colorB: 'rgba(37, 99, 235, 0.9)',
  image: 'https://...',
  imageAlpha: 0.75
});

// Initialize Lens (Drag/Refraction)
const lens = new NakprcLiquidLens(el, {
  strength: 60,
  spring: 0.16,
  damping: 0.82
});
```

See the `/docs` folder for detailed API references of individual modules.
