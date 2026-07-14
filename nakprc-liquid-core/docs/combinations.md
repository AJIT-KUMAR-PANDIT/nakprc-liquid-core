# Combinations

The true power of `nakprc-liquid-core` comes from combining the physics systems. The Blob engine handles the edge wobble and poke mechanics, while the Lens engine handles drag mechanics and optical refraction.

## The Ultimate Liquid Component

By adding both `.nakprc-liquid-glass` and `.nakprc-liquid-lens` to a single element, the `initNakprcDOM()` function will attach both physics engines to it seamlessly.

```html
<div 
  class="nakprc-liquid-glass nakprc-liquid-lens rounded-3xl" 
  style="
    --nakprc-radius: 40px; 
    --nakprc-lens-strength: 60; 
    --nakprc-lens-blur: 4px;
    width: 256px; 
    height: 320px;
  "
  data-color-a="rgba(255, 255, 255, 0.15)" 
  data-color-b="rgba(255, 255, 255, 0.05)"
>
  <span class="nakprc-liquid-label">Drag Me</span>
</div>
```

### What happens under the hood?

1. **Blob Physics**: A canvas is injected *behind* the element's content, drawing the wobbly liquid boundary with `data-color-a` and `data-color-b`.
2. **Lens Physics**: The element is transformed into a movable physics body. An SVG displacement map is applied to its backdrop filter, causing everything *behind* the canvas to bend and refract.

### Image Refraction

You can pass a `data-image` to the blob to render a photo inside the liquid. Because the canvas sits behind the `backdrop-filter` of the lens, the image itself will bend and stretch as you drag it!

```html
<div 
  class="nakprc-liquid-glass nakprc-liquid-lens" 
  data-image="https://example.com/photo.jpg"
  data-image-alpha="0.8"
></div>
```
