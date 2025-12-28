function getOutline(grid) {
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
}
