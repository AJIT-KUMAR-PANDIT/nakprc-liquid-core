const LIQUID_CSS = `
.nakprc-liquid-glass {
  --nakprc-radius: 24px;
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
.nakprc-liquid-glass > *:not(.nakprc-blob-canvas) {
  position: relative;
  z-index: 1;
}

.nakprc-liquid-lens {
  --nakprc-lens-strength: 46; 
  --nakprc-lens-blur: 2px;
  transform-origin: center center;
  will-change: transform;
}
.nakprc-liquid-lens::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--nakprc-lens-hx, 30%) var(--nakprc-lens-hy, 30%), 
    rgba(255,255,255,0.3) 0%, 
    transparent 50%
  );
  z-index: 2;
}
.nakprc-liquid-img {
  will-change: transform;
  display: block;
  pointer-events: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nakprc-liquid-text {
  will-change: transform;
  display: inline-block;
  pointer-events: none;
}
`;

let stylesInjected = false;

export function injectNakprcStyles() {
  if (typeof document === "undefined" || stylesInjected) return;
  const style = document.createElement("style");
  style.textContent = LIQUID_CSS;
  document.head.appendChild(style);
  stylesInjected = true;
}
