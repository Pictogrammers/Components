export const WHITE = '#FFFFFF';

export type Pixel = { x: number, y: number };

export type Point = [number, number];

export enum LayerType {
  Pixel = 'pixel',
  Reference = 'reference',
  Pattern = 'pattern',
  Linear = 'linear',
  Radial = 'radial',
}

/**
 * stop 0 to 1
 * colorIndex
 */
export type GradientStop = [number, number];

interface LayerPixel {
  type: LayerType.Pixel;
  path: string;
  color: number;
}

interface LayerReference {
  type: LayerType.Reference;
  id: string;
  position: Point;
}

interface LayerPattern {
  type: LayerType.Pattern;
  id: string;
  path: string;
  offset: Point;
}

interface LayerLinear {
  type: LayerType.Linear;
  start: Point;
  end: Point;
  stops: GradientStop[];
  dither: 'bayer4' | 'bayer8' | 'bayer16';
}

interface LayerRadial {
  type: LayerType.Radial;
  start: Point;
  end: Point;
  stops: GradientStop[];
  transform: [number, number, number, number, number, number];
  dither: 'bayer4' | 'bayer8' | 'bayer16';
}
