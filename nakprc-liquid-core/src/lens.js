import { injectNakprcStyles } from './styles.js';
import { nakprcEnsureFilter, getNextLensCount } from './filters.js';

export class NakprcLiquidLens {
  constructor(el, opts = {}) {
    if (typeof window === "undefined" || !el) return;
    injectNakprcStyles(); // Ensure styles exist
    
    this.el = el;
    const cssStrength = parseFloat(window.getComputedStyle(el).getPropertyValue("--nakprc-lens-strength"));
    this.strength = opts.strength ?? (Number.isFinite(cssStrength) ? cssStrength : 46);

    this.filterId = this.strength === 46 ? "nakprc-lens-map" : `nakprc-lens-map-${getNextLensCount()}`;
    nakprcEnsureFilter(this.filterId, this.strength);

    const cs = window.getComputedStyle(el);
    if (cs.position === "static") el.style.position = "relative";
    
    const blurStr = cs.getPropertyValue("--nakprc-lens-blur") || "2px";
    el.style.backdropFilter = `url(#${this.filterId}) blur(${blurStr}) saturate(1.2)`;
    el.style.webkitBackdropFilter = `blur(${blurStr}) saturate(1.2)`;

    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.dragging = false;
    this.spring = opts.spring || 0.16;
    this.damping = opts.damping || 0.82;

    this._bindEvents();
    this._raf = requestAnimationFrame(this._tick.bind(this));
  }

  _bindEvents() {
    this._onDown = (e) => {
      if (e.button !== 0 && e.type !== 'touchstart') return; 
      this.dragging = true;
      this.el.setPointerCapture?.(e.pointerId);
      this._startPointer = { x: e.clientX, y: e.clientY };
      this._startTarget = { x: this.target.x, y: this.target.y };
      this.el.style.cursor = "grabbing";
    };
    this._onMove = (e) => {
      if (!this.dragging) return;
      this.target.x = this._startTarget.x + (e.clientX - this._startPointer.x);
      this.target.y = this._startTarget.y + (e.clientY - this._startPointer.y);
    };
    this._onUp = () => {
      this.dragging = false;
      this.el.style.cursor = "grab";
    };

    this.el.addEventListener("pointerdown", this._onDown);
    window.addEventListener("pointermove", this._onMove);
    window.addEventListener("pointerup", this._onUp);
    if (!this.el.style.cursor) this.el.style.cursor = "grab";
  }

  _tick() {
    const accelX = (this.target.x - this.pos.x) * this.spring;
    const accelY = (this.target.y - this.pos.y) * this.spring;
    this.vel.x = (this.vel.x + accelX) * this.damping;
    this.vel.y = (this.vel.y + accelY) * this.damping;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    const speed = Math.min(18, Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y));
    const angle = Math.atan2(this.vel.y, this.vel.x);
    const stretch = speed / 18; 
    const scaleAlong = 1 + stretch * 0.22;
    const scaleAcross = 1 - stretch * 0.14;

    this.el.style.transform =
      `translate(${this.pos.x}px, ${this.pos.y}px) ` +
      `rotate(${angle}rad) scale(${scaleAlong}, ${scaleAcross}) rotate(${-angle}rad)`;

    const hx = 30 - this.vel.x * 1.4;
    const hy = 26 - this.vel.y * 1.4;
    this.el.style.setProperty("--nakprc-lens-hx", `${hx}%`);
    this.el.style.setProperty("--nakprc-lens-hy", `${hy}%`);

    this._raf = requestAnimationFrame(this._tick.bind(this));
  }

  destroy() {
    if (typeof window !== "undefined") {
      cancelAnimationFrame(this._raf);
      this.el.removeEventListener("pointerdown", this._onDown);
      window.removeEventListener("pointermove", this._onMove);
      window.removeEventListener("pointerup", this._onUp);
    }
  }
}
