export function getGridColorIndexes(arr: number[][]) {
  const seen = new Set();
  const result: number[] = [];
  for (const innerArray of arr) {
    for (const value of innerArray) {
      if (!seen.has(value)) {
        seen.add(value);
        result.push(value);
      }
    }
  }
  return result;
}
