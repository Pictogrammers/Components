export function hexToRgb(hex): { r: number, g: number, b: number} | null {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
};

export function normalizeHex(hex: string) {
  const h = hex.toUpperCase();
  if (h.length === 7) {
    return h;
  } else if (h.length === 4) {
    return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return '#000000';
}

export function cToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

export function rgbToHex(r, g, b) {
  return "#" + cToHex(r) + cToHex(g) + cToHex(b);
};