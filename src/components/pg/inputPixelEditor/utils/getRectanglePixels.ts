export default function getRectanglePixels(x0: number, y0: number, x1: number, y1: number) {
  const pixels: { x: number, y: number }[] = [];
  const oX = Math.min(x0, x1);
  const oY = Math.min(y0, y1);
  var w = Math.abs(x1 - x0) + 1;
  var h = Math.abs(y1 - y0) + 1;

  for (var y = oY; y < oY + h; y++) {
    for (var x = oX; x < oX + w; x++) {
      pixels.push({ x, y });
    }
  }

  return pixels;
}
