/*export function getOutline(grid) {
  const outline: number[][] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Directions: [dx, dy]
  const dirs = [
    [0, -1], // up
    [1, 0],  // right
    [0, 1],  // down
    [-1, 0]  // left
  ];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== 1) continue;

      // Check if this cell touches the boundary of the shape
      let isBoundary = false;

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        // If neighbor is out of bounds OR is zero, this is an outline cell
        if (ny < 0 || ny >= rows || nx < 0 || nx >= cols || grid[ny][nx] === 0) {
          isBoundary = true;
          break;
        }
      }

      if (isBoundary) {
        outline.push([x, y]);
      }
    }
  }

  return outline;
} */

export function getOutline(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // ------------------------------------------------------------
  // 1. Flood-fill background reachable from outside
  // ------------------------------------------------------------
  const outside = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue: number[][] = [];

  // Add border 0-cells
  for (let x = 0; x < cols; x++) {
    if (grid[0][x] === 0) queue.push([x, 0]);
    if (grid[rows - 1][x] === 0) queue.push([x, rows - 1]);
  }
  for (let y = 0; y < rows; y++) {
    if (grid[y][0] === 0) queue.push([0, y]);
    if (grid[y][cols - 1] === 0) queue.push([cols - 1, y]);
  }

  // BFS flood fill
  while (queue.length) {
    const [x, y] = queue.shift() as number[];
    if (outside[y][x]) continue;
    outside[y][x] = true;

    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (
        nx >= 0 && nx < cols &&
        ny >= 0 && ny < rows &&
        grid[ny][nx] === 0 &&
        !outside[ny][nx]
      ) {
        queue.push([nx, ny]);
      }
    }
  }

  // ------------------------------------------------------------
  // 2. Collect boundary cells (unordered)
  // ------------------------------------------------------------
  const boundary = new Set();
  const key = (x, y) => `${x},${y}`;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) continue;

      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      for (const [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;

        if (
          nx < 0 || nx >= cols ||
          ny < 0 || ny >= rows ||
          (grid[ny][nx] !== 1 && outside[ny][nx])
        ) {
          boundary.add(key(x, y));
          break;
        }
      }
    }
  }

  if (boundary.size === 0) return [];

  // ------------------------------------------------------------
  // 3. SAFE OUTLINE WALK (no infinite loops)
  // ------------------------------------------------------------

  // Convert boundary set to a fast lookup
  const isBoundary = (x, y) => boundary.has(key(x, y));

  // Find a starting boundary cell
  const [startKey] = boundary;
  // @ts-ignore
  const [sx, sy] = startKey.split(',').map(Number);

  const outline: number[][] = [];
  const visited = new Set();
  let current = { x: sx, y: sy };

  // Moore-neighborhood directions (8 directions)
  const dirs8 = [
    [1,0], [1,1], [0,1], [-1,1],
    [-1,0], [-1,-1], [0,-1], [1,-1]
  ];

  const maxSteps = rows * cols * 8;

  for (let step = 0; step < maxSteps; step++) {
    outline.push([current.x, current.y]);
    visited.add(key(current.x, current.y));

    // Try to find next boundary neighbor
    let next = null;
    for (const [dx, dy] of dirs8) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (isBoundary(nx, ny) && !visited.has(key(nx, ny))) {
        // @ts-ignore
        next = { x: nx, y: ny };
        break;
      }
    }

    // If no next step → open contour (C-shape)
    if (!next) break;

    // If next is start → closed loop
    // @ts-ignore
    if (next.x === sx && next.y === sy) {
      outline.push([sx, sy]);
      break;
    }

    current = next;
  }

  return outline;
}
