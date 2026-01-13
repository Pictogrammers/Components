export function diffMap(map1, map2) {
  // 1. Get all keys from both maps as Sets
  const keys1 = new Set(map1.keys());
  const keys2 = new Set(map2.keys());

  // 2. Combine all unique keys into a single Set
  const allKeys = new Set([...new Set(map1.keys()), ...new Set(map2.keys())]);

  // 3. Filter the combined keys to find those not present in either original Set
  const uniqueKeys = new Set();
  for (const key of allKeys) {
    if (!keys1.has(key) || !keys2.has(key)) {
      uniqueKeys.add(key);
    }
  }

  return uniqueKeys;
}

export function diffLeftMapPixels(map1: Map<string, number[]>, map2: Map<string, number[]>) {
  const leftPixels: number[][] = [];

  // Iterate over all keys in the first map
  for (const key of map1.keys()) {
    // If the second map does not have the current key, add it to the results
    if (!map2.has(key)) {
      leftPixels.push(map1.get(key) as number[]);
    }
  }

  return leftPixels;
}
