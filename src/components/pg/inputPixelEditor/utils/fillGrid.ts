export default function fillGrid(width: number, height: number): number[][] {
  let arr: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      row.push(0);
    }
    arr.push(row);
  }
  return arr;
}