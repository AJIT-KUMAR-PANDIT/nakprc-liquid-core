import { NakprcLiquidBlob } from './blob.js';
import { NakprcLiquidLens } from './lens.js';

export function initNakprcDOM() {
  if (typeof document === "undefined") return;
  
  document.querySelectorAll(".nakprc-liquid-glass").forEach((el) => {
    if (!el._nakprcBlob) el._nakprcBlob = new NakprcLiquidBlob(el);
  });
  
  document.querySelectorAll(".nakprc-liquid-lens").forEach((el) => {
    if (!el._nakprcLens) el._nakprcLens = new NakprcLiquidLens(el);
  });
}
