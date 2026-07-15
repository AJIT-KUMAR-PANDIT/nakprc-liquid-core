import { injectNakprcStyles } from './styles.js';

export class NakprcLiquidBlob {
  constructor(el, opts = {}) {
    if (typeof window === "undefined" || !el) return;
    injectNakprcStyles(); // Ensure styles exist

    this.el = el;
    this.points = opts.points || 64;
    this.margin = opts.margin ?? 50; 
    
    this.colorA = opts.colorA || el.dataset.colorA || "rgba(140, 215, 250, 0.85)";
    this.colorB = opts.colorB || el.dataset.colorB || "rgba(20, 110, 190, 0.85)";

    this.imageUrl = opts.image || el.dataset.image;
    
    this.imageAlpha = parseFloat(opts.imageAlpha || el.dataset.imageAlpha || "1");
    if (this.imageUrl) {
      this.img = new Image();
      this.img.crossOrigin = "anonymous";
      this.img.src = this.imageUrl;
    }

    this.spring = 0.05;
    this.damping = 0.9;
    this.spread = 0.28; 

    this._buildDom();
    this._resize();
    this._resizeObserver = new ResizeObserver(() => this._resize());
    this._resizeObserver.observe(el);

    this.disp = new Array(this.points).fill(0);
    this.vel = new Array(this.points).fill(0);
    this.pointer = null; 

    this._bindEvents();
    this._t = 0;
    this._raf = requestAnimationFrame(this._tick.bind(this));
  }

  _buildDom() {
    const style = window.getComputedStyle(this.el);
    if (style.position === "static") this.el.style.position = "relative";
    
    this.canvas = document.createElement("canvas");
    this.canvas.className = "nakprc-blob-canvas";
    this.canvas.style.cssText = "position:absolute;pointer-events:none;display:block;z-index:0;";
    this.el.insertBefore(this.canvas, this.el.firstChild);
    this.ctx = this.canvas.getContext("2d");
  }

  _resize() {
    const rect = this.el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cs = window.getComputedStyle(this.el);
    this.baseW = Math.max(1, rect.width);
    this.baseH = Math.max(1, rect.height);
    
    this.radius = Math.min(
      parseFloat(cs.getPropertyValue("--nakprc-radius")) || Math.min(this.baseW, this.baseH) * 0.5,
      Math.min(this.baseW, this.baseH) / 2
    );

    const m = this.margin;
    this.canvas.style.left = -m + "px";
    this.canvas.style.top = -m + "px";
    this.canvas.style.width = this.baseW + m * 2 + "px";
    this.canvas.style.height = this.baseH + m * 2 + "px";
    this.canvas.width = (this.baseW + m * 2) * dpr;
    this.canvas.height = (this.baseH + m * 2) * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.base = this._samplePerimeter(this.baseW, this.baseH, this.radius, this.points, m);
  }

  _samplePerimeter(w, h, r, n, offset) {
    const segs = [];
    const add = (len, fn) => segs.push({ len, fn });

    add(w - 2 * r, (t) => ({ x: r + t * (w - 2 * r), y: 0, nx: 0, ny: -1 }));
    add((Math.PI / 2) * r, (t) => {
      const a = -Math.PI / 2 + t * (Math.PI / 2);
      return { x: w - r + r * Math.cos(a), y: r + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
    });
    add(h - 2 * r, (t) => ({ x: w, y: r + t * (h - 2 * r), nx: 1, ny: 0 }));
    add((Math.PI / 2) * r, (t) => {
      const a = 0 + t * (Math.PI / 2);
      return { x: w - r + r * Math.cos(a), y: h - r + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
    });
    add(w - 2 * r, (t) => ({ x: w - r - t * (w - 2 * r), y: h, nx: 0, ny: 1 }));
    add((Math.PI / 2) * r, (t) => {
      const a = Math.PI / 2 + t * (Math.PI / 2);
      return { x: r + r * Math.cos(a), y: h - r + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
    });
    add(h - 2 * r, (t) => ({ x: 0, y: h - r - t * (h - 2 * r), nx: -1, ny: 0 }));
    add((Math.PI / 2) * r, (t) => {
      const a = Math.PI + t * (Math.PI / 2);
      return { x: r + r * Math.cos(a), y: r + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
    });

    const total = segs.reduce((s, seg) => s + seg.len, 0) || 1;
    const pts = [];
    for (let i = 0; i < n; i++) {
      let d = (i / n) * total;
      for (const seg of segs) {
        if (d <= seg.len || seg === segs[segs.length - 1]) {
          const t = seg.len > 0 ? d / seg.len : 0;
          const p = seg.fn(Math.min(1, Math.max(0, t)));
          pts.push({ x: p.x + offset, y: p.y + offset, nx: p.nx, ny: p.ny });
          break;
        }
        d -= seg.len;
      }
    }
    return pts;
  }

  _bindEvents() {
    this._onMove = (e) => {
      const rect = this.el.getBoundingClientRect();
      this.pointer = {
        x: (e.clientX ?? e.touches?.[0]?.clientX) - rect.left + this.margin,
        y: (e.clientY ?? e.touches?.[0]?.clientY) - rect.top + this.margin,
      };
    };
    this._onLeave = () => { this.pointer = null; };
    this._onDown = (e) => {
      const rect = this.el.getBoundingClientRect();
      const px = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left + this.margin;
      const py = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top + this.margin;
      this.poke(px, py, 25);
    };

    this.el.addEventListener("pointermove", this._onMove);
    this.el.addEventListener("pointerleave", this._onLeave);
    this.el.addEventListener("pointerdown", this._onDown);
  }

  poke(px, py, force = 20) {
    for (let i = 0; i < this.points; i++) {
      const b = this.base[i];
      const dx = b.x - px;
      const dy = b.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const falloff = Math.exp(-(dist * dist) / (2 * 35 * 35));
      this.vel[i] -= force * falloff;
    }
  }

  _step() {
    for (let i = 0; i < this.points; i++) {
      const b = this.base[i];
      let target = 0;

      if (this.pointer) {
        const dx = b.x - this.pointer.x;
        const dy = b.y - this.pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pull = Math.exp(-(dist * dist) / (2 * 60 * 60));
        target += pull * 12; 
      }

      target += Math.sin(this._t * 0.0012 + i * 0.35) * 0.8; 

      const accel = (target - this.disp[i]) * this.spring;
      this.vel[i] = (this.vel[i] + accel) * this.damping;
      this.disp[i] += this.vel[i];
    }

    const n = this.points;
    const left = new Array(n).fill(0);
    const right = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      const prev = (i - 1 + n) % n;
      const next = (i + 1) % n;
      left[i] = this.spread * (this.disp[i] - this.disp[prev]);
      right[i] = this.spread * (this.disp[i] - this.disp[next]);
      this.vel[prev] += left[i];
      this.vel[next] += right[i];
    }
    for (let i = 0; i < n; i++) {
      const prev = (i - 1 + n) % n;
      const next = (i + 1) % n;
      this.disp[prev] += left[i];
      this.disp[next] += right[i];
    }
  }

  _draw() {
    const ctx = this.ctx;
    const w = this.baseW + this.margin * 2;
    const h = this.baseH + this.margin * 2;
    ctx.clearRect(0, 0, w, h);

    const n = this.points;
    const live = this.base.map((b, i) => ({
      x: b.x + b.nx * this.disp[i],
      y: b.y + b.ny * this.disp[i],
    }));

    ctx.beginPath();
    const mid0 = { x: (live[0].x + live[n - 1].x) / 2, y: (live[0].y + live[n - 1].y) / 2 };
    ctx.moveTo(mid0.x, mid0.y);
    for (let i = 0; i < n; i++) {
      const cur = live[i];
      const next = live[(i + 1) % n];
      const mid = { x: (cur.x + next.x) / 2, y: (cur.y + next.y) / 2 };
      ctx.quadraticCurveTo(cur.x, cur.y, mid.x, mid.y);
    }
    ctx.closePath();

    ctx.save();
    ctx.clip(); 

    if (this.img && this.img.complete) {
      ctx.globalAlpha = this.imageAlpha;
      const imgRatio = this.img.width / this.img.height;
      const canvasRatio = w / h;
      
      // Calculate average velocity for parallax
      let vx = 0, vy = 0;
      for (let i = 0; i < n; i++) {
        vx += this.base[i].nx * this.vel[i];
        vy += this.base[i].ny * this.vel[i];
      }
      vx = vx / (n * 0.1);
      vy = vy / (n * 0.1);
      
      let drawW = w, drawH = h, drawX = 0, drawY = 0;
      
      if (imgRatio > canvasRatio) {
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
      } else {
        drawH = w / imgRatio;
        drawY = (h - drawH) / 2;
      }
      
      // Add parallax shift based on wobble velocity
      drawX += vx * 0.8;
      drawY += vy * 0.8;
      
      ctx.drawImage(this.img, drawX, drawY, drawW, drawH);
      ctx.globalAlpha = 1.0;

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, this.colorA);
      grad.addColorStop(1, this.colorB);
      ctx.fillStyle = grad;
      ctx.fill();
    } else {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, this.colorA);
      grad.addColorStop(1, this.colorB);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    
    ctx.restore();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.stroke();
    
    const hx = this.pointer ? this.pointer.x * 0.4 + w * 0.28 : w * 0.32 + Math.sin(this._t * 0.0007) * 10;
    const hy = this.pointer ? this.pointer.y * 0.4 + h * 0.22 : h * 0.26 + Math.cos(this._t * 0.0009) * 8;
    const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.min(w, h) * 0.4);
    hg.addColorStop(0, "rgba(255,255,255,0.4)");
    hg.addColorStop(1, "rgba(255,255,255,0)");
    
    ctx.save();
    ctx.clip(); 
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  _tick(t) {
    this._t = t;
    this._step();
    this._draw();
    
    // Sync child liquid elements (parallax and skew)
    let vx = 0;
    let vy = 0;
    for (let i = 0; i < this.points; i++) {
      vx += this.base[i].nx * this.vel[i];
      vy += this.base[i].ny * this.vel[i];
    }
    
    // Scale down the accumulated velocity for subtle parallax
    vx = vx / (this.points * 0.1);
    vy = vy / (this.points * 0.1);

    const n = this.points;
    const liquidChildren = this.el.querySelectorAll('.nakprc-liquid-img, .nakprc-liquid-text');
    
    // Apply parallax, skew, and dynamic wobbly clip-path
    liquidChildren.forEach(child => {
      const px = vx * 0.8;
      const py = vy * 0.8;
      const sx = vx * 0.3;
      const sy = vy * 0.3;
      
      // Compute clip-path coordinates relative to the DOM element (without margin, offset by translation)
      const liveDom = this.base.map((b, i) => ({
        x: b.x + b.nx * this.disp[i] - this.margin - px,
        y: b.y + b.ny * this.disp[i] - this.margin - py,
      }));

      if (child.classList.contains('nakprc-liquid-img')) {
        let polyStr = 'polygon(';
        for (let i = 0; i < n; i++) {
          polyStr += `${liveDom[i].x}px ${liveDom[i].y}px`;
          if (i < n - 1) polyStr += ', ';
        }
        polyStr += ')';
        child.style.clipPath = polyStr;
        child.style.webkitClipPath = polyStr;
      }
      
      child.style.transform = `translate(${px}px, ${py}px) skew(${sx}deg, ${sy}deg)`;
    });

    this._raf = requestAnimationFrame(this._tick.bind(this));
  }

  destroy() {
    if (typeof window !== "undefined") {
      cancelAnimationFrame(this._raf);
      this._resizeObserver.disconnect();
      this.el.removeEventListener("pointermove", this._onMove);
      this.el.removeEventListener("pointerleave", this._onLeave);
      this.el.removeEventListener("pointerdown", this._onDown);
      this.canvas.remove();
    }
  }
}
