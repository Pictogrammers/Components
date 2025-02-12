export function rasterizePath(pathData: string, width: number, height: number) {
  const grid: Number[][] = Array(height).fill(0).map(() => Array(width).fill(0));

  // Store only the vertical edges
  const verticalEdges: { x: number, y: number[] }[] = [];

  const paths = pathData.match(/M[^Z]*Z/g) || [];
  for (const path of paths) {
    let x0;
    let y0;
    let x;
    let y;
    // Split the path data into commands
    const commands = path.match(/[MHVZ][\d,]*/g) || [];

    for (const cmd of commands) {
      const type = cmd[0];
      const value = cmd.slice(1);
      let newY;

      switch (type) {
        case 'M': {
          const [vX, vY] = value.split(',').map(v => parseInt(v, 10));
          x = vX;
          y = vY;
          x0 = vX;
          y0 = vY;
          break;
        }
        case 'H':
          x = parseInt(value, 10);
          break;
        case 'V':
          newY = parseInt(value, 10);
          verticalEdges.push({ x, y: [y, newY].sort((a, b) => a - b) });
          y = newY;
          break;
        case 'Z':
          if (x0 === x) {
            verticalEdges.push({ x, y: [y, y0].sort((a, b) => a - b) });
          }
          break;
      }
    }
  }

  // Fill the shape using scan-line algorithm
  for (let y = 0; y < height; ++y) {
    let inside = false;

    for (let x = 0; x < width; ++x) {
      // Check if we cross a vertical edge
      for (const verticalEdge of verticalEdges) {
        if (verticalEdge.x === x && y >= verticalEdge.y[0] && y < verticalEdge.y[1]) {
          inside = !inside;
          break;
        }
      }
      if (inside) {
        grid[y][x] = 1;
      }
    }
  }

  return grid;
}