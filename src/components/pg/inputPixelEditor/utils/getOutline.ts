export function getOutline(pixels: number[][], ignoreInside: boolean = false, include: number[] = []) {
  const moatPixels: number[][] = [];
  const height = pixels.length;
  if (height === 0) return moatPixels;
  const width = pixels[0].length;

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];

  // ---------------------------------------------------------
  // STEP 1: If ignoring inside, flood-fill from the outside
  // ---------------------------------------------------------
  let outsideZero: boolean[][] = Array.from({ length: height }, () =>
    Array(width).fill(false)
  );

  if (ignoreInside) {
    const queue: [number, number][] = [];

    // Seed flood-fill with all border zeros
    for (let x = 0; x < width; x++) {
      if (pixels[0][x] === 0) queue.push([x, 0]);
      if (pixels[height - 1][x] === 0) queue.push([x, height - 1]);
    }
    for (let y = 0; y < height; y++) {
      if (pixels[y][0] === 0) queue.push([0, y]);
      if (pixels[y][width - 1] === 0) queue.push([width - 1, y]);
    }

    // BFS flood-fill
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      if (outsideZero[y][x]) continue;
      outsideZero[y][x] = true;

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          pixels[ny][nx] === 0 &&
          !outsideZero[ny][nx]
        ) {
          queue.push([nx, ny]);
        }
      }
    }
  }

  // ---------------------------------------------------------
  // STEP 2: Collect moat pixels
  // ---------------------------------------------------------
  const moatSet = new Set<string>();

  let condition = (pixel) => pixel === 0;
  if (include.length !== 0) {
    condition = (pixel) => !include.includes(pixel);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (condition(pixels[y][x])) continue;

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

        if (pixels[ny][nx] === 0) {
          // If ignoring inside, only count zeros reachable from outside
          if (ignoreInside && !outsideZero[ny][nx]) continue;

          const key = `${nx},${ny}`;
          if (!moatSet.has(key)) {
            moatSet.add(key);
            moatPixels.push([nx, ny]);
          }
        }
      }
    }
  }

  return moatPixels;
}
