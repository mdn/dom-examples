/**
 * Pointer distortion post-effect for an existing 2D canvas.
 * Call fx.apply() once per frame, AFTER your scene has been drawn.
 * Only pixels near the pointer are read and rewritten, so it stays cheap.
 *
 * const ctx = canvas.getContext('2d', { willReadFrequently: true });
 * const fx = createPointerDistort(canvas);
 * function loop(t) { drawMyScene(ctx, t); fx.apply(t); requestAnimationFrame(loop); }
 */
export function createPointerDistort(canvas, options = {}) {
  const o = {
    radius: 140, // CSS pixels
    swirl: 0.45, // radians of twist at the centre
    magnify: 0.18, // 0 = none, higher = stronger lens
    ripple: 0.015, // ripple amplitude
    chroma: 4, // RGB split in CSS pixels
    invert: 0.1, // blend toward inverted colour at centre
    ease: 0.18, // pointer smoothing (1 = no lag)
    ...options,
  };
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const m = { x: 0, y: 0, tx: 0, ty: 0, active: false };

  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) * canvas.width) / r.width;
    const y = ((e.clientY - r.top) * canvas.height) / r.height;
    if (!m.active) {
      m.x = x;
      m.y = y;
    } // snap on entry so it doesn't slide in
    m.tx = x;
    m.ty = y;
    m.active = true;
  }
  const onLeave = () => {
    m.active = false;
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);

  function apply(timeMs = performance.now()) {
    if (!m.active) return;
    m.x += (m.tx - m.x) * o.ease;
    m.y += (m.ty - m.y) * o.ease;

    // Convert CSS-pixel options to canvas pixels (handles devicePixelRatio / resized canvases)
    const s = canvas.width / canvas.getBoundingClientRect().width || 1;
    const R = o.radius * s,
      CA = o.chroma * s,
      time = timeMs / 1000;
    const pad = Math.ceil(CA) + 2;

    // Fetch only a small box around the pointer
    const x0 = Math.max(0, Math.floor(m.x - R - pad));
    const y0 = Math.max(0, Math.floor(m.y - R - pad));
    const x1 = Math.min(canvas.width, Math.ceil(m.x + R + pad));
    const y1 = Math.min(canvas.height, Math.ceil(m.y + R + pad));
    const bw = x1 - x0,
      bh = y1 - y0;
    if (bw <= 0 || bh <= 0) return;

    const img = ctx.getImageData(x0, y0, bw, bh); // throws if the canvas is tainted (see note below)
    const src = img.data;
    const dst = new Uint8ClampedArray(src); // copy; we read src, write dst
    const mx = m.x - x0,
      my = m.y - y0; // pointer in box coordinates

    const px = (x, y, c) => {
      x = x < 0 ? 0 : x >= bw ? bw - 1 : x | 0;
      y = y < 0 ? 0 : y >= bh ? bh - 1 : y | 0;
      return src[(y * bw + x) * 4 + c];
    };

    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const dx = x - mx,
          dy = y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 >= R * R || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const t = 1 - d / R;
        const f = t * t * (3 - 2 * t); // smoothstep falloff

        const a = f * o.swirl,
          cos = Math.cos(a),
          sin = Math.sin(a);
        const k =
          1 -
          o.magnify * f +
          o.ripple * f * Math.sin((d / s) * 0.14 - time * 3);
        const sx = mx + (dx * cos - dy * sin) * k;
        const sy = my + (dx * sin + dy * cos) * k;

        const ca = f * CA,
          ux = dx / d,
          uy = dy / d;
        let r = px(sx + ux * ca, sy + uy * ca, 0);
        let g = px(sx, sy, 1);
        let b = px(sx - ux * ca, sy - uy * ca, 2);

        const inv = f * f * o.invert;
        r += (255 - 2 * r) * inv;
        g += (255 - 2 * g) * inv;
        b += (255 - 2 * b) * inv;

        const i = (y * bw + x) * 4;
        dst[i] = r;
        dst[i + 1] = g;
        dst[i + 2] = b;
      }
    }
    ctx.putImageData(new ImageData(dst, bw, bh), x0, y0);
  }

  function destroy() {
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
  }

  return { apply, destroy, options: o };
}
