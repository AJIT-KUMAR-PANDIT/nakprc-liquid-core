import { NakprcLiquidBlob } from './blob.js';
import { NakprcLiquidLens } from './lens.js';

let isObserving = false;

export function initNakprcDOM() {
  if (typeof document === "undefined") return;
  
  const scan = () => {
    document.querySelectorAll(".nakprc-liquid-glass").forEach((el) => {
      if (!el._nakprcBlob) el._nakprcBlob = new NakprcLiquidBlob(el);
    });
    
    document.querySelectorAll(".nakprc-liquid-lens").forEach((el) => {
      if (!el._nakprcLens) el._nakprcLens = new NakprcLiquidLens(el);
    });
  };

  scan(); // Initial scan

  if (!isObserving) {
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          shouldScan = true;
          break;
        }
      }
      if (shouldScan) scan();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    isObserving = true;
  }
}
