/**
 * Represents a coordinate in the 2D array.
 */
type Coordinate = [number, number];

/**
 * Flood fills a 2D array starting from a specific coordinate to find all connected numbers
 * that are within a specified set of target values.
 *
 * @param grid The 2D array (grid) of numbers.
 * @param startX The starting x-coordinate.
 * @param startY The starting y-coordinate.
 * @param targetValues The set of numbers to search for (e.g., [1, 2, 5]).
 * @returns A list of [x, y] coordinates that were found during the flood fill.
 */
export function getFloodFill(
  grid: number[][],
  startX: number,
  startY: number,
  targetValues: number[]
): Coordinate[] {
  // Use a Set for quick lookups of target values
  const targets = new Set(targetValues);

  // Check if starting coordinates are valid and if the value at the start is a target
  if (
    startY < 0 ||
    startY >= grid.length ||
    startX < 0 ||
    startX >= grid[0].length ||
    !targets.has(grid[startY][startX])
  ) {
    return [];
  }

  // Queue for Breadth-First Search (BFS)
  const queue: Coordinate[] = [[startX, startY]];
  // Set to keep track of visited coordinates to avoid cycles and redundant processing
  const visited = new Set<string>();
  const foundPixels: Coordinate[] = [];

  // Helper to convert [x, y] to a string key for the 'visited' set
  const toKey = (x: number, y: number) => `${x},${y}`;

  // Mark the starting pixel as visited and add to found list
  visited.add(toKey(startX, startY));
  foundPixels.push([startX, startY]);

  while (queue.length > 0) {
    const [currentX, currentY] = queue.shift()!;
    const currentValue = grid[currentY][currentX];

    // Define potential neighbors (up, down, left, right)
    const neighbors: Coordinate[] = [
      [currentX + 1, currentY],
      [currentX - 1, currentY],
      [currentX, currentY + 1],
      [currentX, currentY - 1],
    ];

    for (const [nextX, nextY] of neighbors) {
      // Check bounds
      if (
        nextY >= 0 &&
        nextY < grid.length &&
        nextX >= 0 &&
        nextX < grid[0].length
      ) {
        const neighborValue = grid[nextY][nextX];
        const key = toKey(nextX, nextY);

        // If the neighbor has a target value and has not been visited yet
        if (targets.has(neighborValue) && !visited.has(key)) {
          visited.add(key);
          foundPixels.push([nextX, nextY]);
          queue.push([nextX, nextY]);
        }
      }
    }
  }

  return foundPixels;
}
