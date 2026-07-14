/**
 * Nakprc Liquid Core - npm package entry
 * Exporting liquid physics and optics for component libraries.
 */

export { injectNakprcStyles } from './src/styles.js';
export { NakprcLiquidLens } from './src/lens.js';
export { NakprcLiquidBlob } from './src/blob.js';
export { initNakprcDOM } from './src/init.js';

export const LIQUID_GLASS = "nakprc-liquid-glass";
export const LIQUID_LENS = "nakprc-liquid-lens";
export const LIQUID_IMG = "nakprc-liquid-img";
export const LIQUID_TEXT = "nakprc-liquid-text";