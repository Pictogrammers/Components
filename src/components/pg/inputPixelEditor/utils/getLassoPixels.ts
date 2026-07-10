import getLinePixels from './getLinePixels';
import { Pixel } from './constants';

/**
 * Returns all pixels inside (and on the border of) a freehand lasso path.
 *
 * The path is a sequence of grid-cell coordinates visited during the drag.
 * Consecutive points are connected with Bresenham lines to form the outline,
 * and the interior is filled with an even-odd scanline rule.
 */
export default function getLassoPixels(path: [number, number][]): Pixel[] {
  if (path.length < 3) { return []; }

  const result = new Map<string, Pixel>();
  const n = path.length;

  // Outline: Bresenham lines between consecutive path points, closing back to start
  for (let i = 0; i < n; i++) {
    const [x0, y0] = path[i];
    const [x1, y1] = path[(i + 1) % n];
    for (const { x, y } of getLinePixels(x0, y0, x1, y1)) {
      result.set(`${x},${y}`, { x, y });
    }
  }

  // Scanline interior fill — test at row + 0.5 to avoid vertex ambiguities
  const minY = Math.min(...path.map(([, y]) => y));
  const maxY = Math.max(...path.map(([, y]) => y));

  for (let row = minY; row <= maxY; row++) {
    const intersections: number[] = [];
    for (let i = 0; i < n; i++) {
      const [x0, y0] = path[i];
      const [x1, y1] = path[(i + 1) % n];
      if ((y0 <= row && y1 > row) || (y1 <= row && y0 > row)) {
        const t = (row + 0.5 - y0) / (y1 - y0);
        intersections.push(x0 + t * (x1 - x0));
      }
    }
    intersections.sort((a, b) => a - b);
    for (let i = 0; i + 1 < intersections.length; i += 2) {
      const xStart = Math.ceil(intersections[i]);
      const xEnd = Math.floor(intersections[i + 1]);
      for (let x = xStart; x <= xEnd; x++) {
        result.set(`${x},${row}`, { x, y: row });
      }
    }
  }

  return Array.from(result.values());
}
