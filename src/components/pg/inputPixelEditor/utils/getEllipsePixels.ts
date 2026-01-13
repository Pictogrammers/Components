export function distance(x: number, y: number, ratio: number): number {
	return Math.sqrt((Math.pow(y * ratio, 2)) + Math.pow(x, 2));
}

function filled(x: number, y: number, radius: number, ratio: number): boolean {
  return distance(x, y, ratio) <= radius;
}

function thinfilled(x: number, y: number, radius: number, ratio: number): boolean {
  return filled(x, y, radius, ratio) && !(
    filled(x + 1, y, radius, ratio) &&
    filled(x - 1, y, radius, ratio) &&
    filled(x, y + 1, radius, ratio) &&
    filled(x, y - 1, radius, ratio)
  );
}

function isFilled(x: number, y: number, width: number, height: number): boolean {
  const bounds = {
    minX: 0,
    maxX: width,
    minY: 0,
    maxY: height,
  };

  x = -.5 * (bounds.maxX - 2 * (x + .5));
  y = -.5 * (bounds.maxY - 2 * (y + .5));

  return thinfilled(x, y, (bounds.maxX / 2), bounds.maxX / bounds.maxY);
}


function betterCircle(x0: number, y0: number, x1: number, y1: number) {
  const width = Math.abs(x0 - x1);
  const height = Math.abs(y0 - y1);
  const minX = Math.min(x0, x1);
  const minY = Math.min(y0, y1);

  const pixels: { x: number, y: number }[] = [];

  // Loop through bounding box
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Center coordinates relative to ellipse
      const cx = -.5 * (width - 2 * (x + 0.5));
      const cy = -.5 * (height - 2 * (y + 0.5));

      // Use filled() instead of thinfilled() to fill the ellipse
      if (filled(cx, cy, width / 2, width / height)) {
        pixels.push({ x: x + minX, y: y + minY });
      }
    }
  }

  return pixels;
}


function ellipse(x0: number, y0: number, x1: number, y1: number) {
  const pixels: { x: number, y: number }[] = [];

  let a = Math.abs(x1 - x0),
    b = Math.abs(y1 - y0),
    b1 = b & 1;

  let dx = 4 * (1.0 - a) * b * b,
    dy = 4 * (b1 + 1) * a * a;

  let err = dx + dy + b1 * a * a,
    e2;

  if (x0 > x1) {
    x0 = x1;
    x1 += a;
  }
  if (y0 > y1) y0 = y1;
  y0 += (b + 1) >> 1;
  y1 = y0 - b1;

  a = 8 * a * a;
  b1 = 8 * b * b;

  // Outline drawing
  do {
    pixels.push({ x: x1, y: y0 }); // I Quadrant
    pixels.push({ x: x0, y: y0 }); // II Quadrant
    pixels.push({ x: x0, y: y1 }); // III Quadrant
    pixels.push({ x: x1, y: y1 }); // IV Quadrant

    e2 = 2 * err;
    if (e2 <= dy) {
      y0++;
      y1--;
      err += dy += a;
    }
    if (e2 >= dx || 2 * err > dy) {
      x0++;
      x1--;
      err += dx += b1;
    }
  } while (x0 <= x1);

  while (y0 - y1 <= b) {
    pixels.push({ x: x0 - 1, y: y0 });
    pixels.push({ x: x1 + 1, y: y0++ });
    pixels.push({ x: x0 - 1, y: y1 });
    pixels.push({ x: x1 + 1, y: y1-- });
  }

  // --- Fill interior ---
  // Group pixels by row (y), then fill between minX and maxX
  const rows: Record<number, { minX: number; maxX: number }> = {};
  for (const p of pixels) {
    if (!(p.y in rows)) {
      rows[p.y] = { minX: p.x, maxX: p.x };
    } else {
      rows[p.y].minX = Math.min(rows[p.y].minX, p.x);
      rows[p.y].maxX = Math.max(rows[p.y].maxX, p.x);
    }
  }

  const filledPixels: { x: number; y: number }[] = [...pixels];
  for (const y in rows) {
    const { minX, maxX } = rows[y];
    for (let x = minX; x <= maxX; x++) {
      filledPixels.push({ x, y: parseInt(y) });
    }
  }

  return filledPixels;
}


export default function getEllipsePixels(x0: number, y0: number, x1: number, y1: number) {
  if (Math.abs(x0 - x1) === Math.abs(y0 - y1) && Math.abs(x0 - x1)) {
    console.log('circle', Math.abs(x0 - x1), Math.abs(y0 - y1))
    return betterCircle(x0, y0, x1 + 1, y1 + 1);
  }
  return ellipse(x0, y0, x1, y1);
}
