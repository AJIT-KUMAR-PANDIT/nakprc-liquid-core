function nakprcBuildBumpMapDataUrl(size = 256) {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  const c = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - c) / c;
      const ny = (y - c) / c;
      const r = Math.sqrt(nx * nx + ny * ny);
      let dx = 0, dy = 0;
      if (r < 1) {
        const z = Math.sqrt(1 - r * r);
        const factor = 1 - z;
        dx = nx * factor;
        dy = ny * factor;
      }
      const i = (y * size + x) * 4;
      img.data[i] = Math.max(0, Math.min(255, 128 + dx * 127));
      img.data[i + 1] = Math.max(0, Math.min(255, 128 + dy * 127));
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

let nakprcBumpMapUrl = null;
let nakprcLensCount = 0;

export function getNextLensCount() {
  return ++nakprcLensCount;
}

export function nakprcEnsureFilter(id, strength) {
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return;
  if (!nakprcBumpMapUrl) nakprcBumpMapUrl = nakprcBuildBumpMapDataUrl();

  let host = document.getElementById("nakprc-lens-svg-host");
  if (!host) {
    host = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    host.id = "nakprc-lens-svg-host";
    host.setAttribute("width", "0");
    host.setAttribute("height", "0");
    host.style.cssText = "position:absolute;overflow:hidden;pointer-events:none;z-index:-1;";
    host.innerHTML = "<defs></defs>";
    document.body.appendChild(host);
  }
  const defs = host.querySelector("defs");
  const svgNS = "http://www.w3.org/2000/svg";
  
  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("x", "-15%");
  filter.setAttribute("y", "-15%");
  filter.setAttribute("width", "130%");
  filter.setAttribute("height", "130%");

  const feImage = document.createElementNS(svgNS, "feImage");
  feImage.setAttribute("href", nakprcBumpMapUrl);
  feImage.setAttribute("x", "0");
  feImage.setAttribute("y", "0");
  feImage.setAttribute("width", "100%");
  feImage.setAttribute("height", "100%");
  feImage.setAttribute("preserveAspectRatio", "none");
  feImage.setAttribute("result", "nakprcMap");

  const feDisp = document.createElementNS(svgNS, "feDisplacementMap");
  feDisp.setAttribute("in", "SourceGraphic");
  feDisp.setAttribute("in2", "nakprcMap");
  feDisp.setAttribute("scale", String(strength));
  feDisp.setAttribute("xChannelSelector", "R");
  feDisp.setAttribute("yChannelSelector", "G");

  filter.appendChild(feImage);
  filter.appendChild(feDisp);
  defs.appendChild(filter);
}
