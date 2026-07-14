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
.nakprc-liquid-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7), 0 0 12px rgba(0, 0, 0, 0.4);
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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
`;

let stylesInjected = false;

export function injectNakprcStyles() {
  if (typeof document === "undefined" || stylesInjected) return;
  const style = document.createElement("style");
  style.textContent = LIQUID_CSS;
  document.head.appendChild(style);
  stylesInjected = true;
}
