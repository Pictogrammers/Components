import { readFnt } from '@pictogrammers/fnt';

type FntFont = ReturnType<typeof readFnt>;
type FntChar = FntFont['chars'][number];

type StackEntry =
  | { type: 'clip'; x: number; y: number; w: number; h: number }
  | { type: 'origin'; x: number; y: number };

function parseCSSColor(css: string): [number, number, number] {
  const m = css.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (m) return [+m[1], +m[2], +m[3]];
  if (css === 'white' || css === '#fff' || css === '#ffffff') return [255, 255, 255];
  if (css === 'black' || css === '#000' || css === '#000000') return [0, 0, 0];
  return [128, 128, 128];
}

export class MockFont {
  readonly fnt: FntFont;
  readonly atlas: HTMLCanvasElement;
  readonly charMap: Map<number, FntChar>;
  readonly kerningMap: Map<string, number>;
  readonly isGrayAtlas: boolean;

  constructor(fnt: FntFont, atlas: HTMLCanvasElement, isGrayAtlas: boolean) {
    this.fnt = fnt;
    this.atlas = atlas;
    this.isGrayAtlas = isGrayAtlas;

    this.charMap = new Map();
    for (const ch of fnt.chars) {
      this.charMap.set(ch.id, ch);
    }

    this.kerningMap = new Map();
    for (const k of fnt.kernings) {
      this.kerningMap.set(`${k.first},${k.second}`, k.amount);
    }
  }

  get name(): string {
    return this.fnt.info.face;
  }

  get height(): number {
    return this.fnt.common.lineHeight;
  }

  static async load(fntUrl: string): Promise<MockFont> {
    const buffer = await fetch(fntUrl).then(r => r.arrayBuffer());
    const fnt = readFnt(buffer);
    const bmpUrl = fnt.pages[0].replace('.png', '.bmp');
    // Load from resourceBMP if found
    if (resourcesBMP.has(bmpUrl)) {
      const mockBitmap = resourcesBMP.get(bmpUrl);
      const { canvas, isGray } = MockFont._processAtlas(mockBitmap?._canvas!);
      return new MockFont(fnt, canvas, isGray);
    }
    /*
    // Backup request image
    const dir = fntUrl.substring(0, fntUrl.lastIndexOf('/') + 1);
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load font texture: ${fnt.pages[0]}`));
      img.src = dir + fnt.pages[0];
    });

    const { canvas, isGray } = MockFont._processAtlas(image);
    return new MockFont(fnt, canvas, isGray);*/
    // @ts-ignore
    return new MockFont(fnt, null, true);
  }

  static from(fnt: FntFont): MockFont {
    const bmpUrl = fnt.pages[0].replace('.png', '.bmp');
    if (resourcesBMP.has(bmpUrl)) {
      const mockBitmap = resourcesBMP.get(bmpUrl);
      const { canvas, isGray } = MockFont._processAtlas(mockBitmap?._canvas!);
      return new MockFont(fnt, canvas, isGray);
    }

    // Backup request image
    /*const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load font texture: ${bmpUrl}`));
      img.src = bmpUrl;
    });

    const { canvas, isGray } = MockFont._processAtlas(image);
    return new MockFont(fnt, canvas, isGray);*/
    // @ts-ignore
    return new MockFont(fnt, null, false);
  }

  // For opaque black-background atlases that are purely grayscale (R≈G≈B),
  // converts pixel luminance to the alpha channel so source-in colorization works.
  // Color atlases are stored as-is; the caller uses isGray to choose the draw path.
  private static _processAtlas(canvas: HTMLCanvasElement): { canvas: HTMLCanvasElement; isGray: boolean } {
    const ctx = canvas.getContext('2d')!;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;

    if (d[3] > 128 && d[0] < 128) {
      let isGray = true;
      for (let i = 0; i < d.length; i += 4) {
        if (Math.abs(d[i] - d[i + 1]) > 8 || Math.abs(d[i + 1] - d[i + 2]) > 8) {
          isGray = false;
          break;
        }
      }
      if (isGray) {
        for (let i = 0; i < d.length; i += 4) {
          const luma = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000;
          d[i] = 255;
          d[i + 1] = 255;
          d[i + 2] = 255;
          d[i + 3] = luma;
        }
        ctx.putImageData(imageData, 0, 0);
        return { canvas, isGray: true };
      }
    }

    return { canvas, isGray: false };
  }
}

function drawToCanvas(bytes: Uint8Array, canvas: HTMLCanvasElement): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "image/png" });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

export class MockBitmap {
  readonly _canvas: HTMLCanvasElement;
  readonly _imageData: ImageData;
  readonly width: number;
  readonly height: number;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    const ctx = canvas.getContext('2d')!;
    this._imageData = ctx.getImageData(0, 0, this.width, this.height);
  }

  static create(
    width: number,
    height: number,
    drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
  ): MockBitmap {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    drawFn(c.getContext('2d')!, width, height);
    return new MockBitmap(c);
  }

  static from(
    buffer: Uint8Array,
  ) {
    const c = document.createElement('canvas');
    drawToCanvas(buffer, c);
    return new MockBitmap(c);
  }
}

export class MockPoco {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;

  private _stack: StackEntry[];
  private _originX: number;
  private _originY: number;
  private _clipX: number;
  private _clipY: number;
  private _clipW: number;
  private _clipH: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    this._stack = [];
    this._originX = 0;
    this._originY = 0;
    this._clipX = 0;
    this._clipY = 0;
    this._clipW = this.width;
    this._clipH = this.height;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  begin(x = 0, y = 0, w = this.width, h = this.height): void {
    this._originX = 0;
    this._originY = 0;
    this._clipX = x;
    this._clipY = y;
    this._clipW = w;
    this._clipH = h;
    this._stack = [];
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.clip();
  }

  end(): void {
    this.ctx.restore();
  }

  close(): void { }

  // ── Color ──────────────────────────────────────────────────────────────────

  makeColor(r: number, g: number, b: number): string {
    return `rgb(${r},${g},${b})`;
  }

  // ── Clip & Origin ──────────────────────────────────────────────────────────

  clip(): void;
  clip(x: number, y: number, w: number, h: number): true | undefined;
  clip(x?: number, y?: number, w?: number, h?: number): true | undefined | void {
    if (x === undefined) {
      const prev = this._stack.pop();
      if (prev && prev.type === 'clip') {
        this._clipX = prev.x;
        this._clipY = prev.y;
        this._clipW = prev.w;
        this._clipH = prev.h;
        this._applyClip();
      }
      return;
    }

    this._stack.push({ type: 'clip', x: this._clipX, y: this._clipY, w: this._clipW, h: this._clipH });

    const ax = this._originX + x;
    const ay = this._originY + (y ?? 0);
    const bx = Math.max(this._clipX, ax);
    const by = Math.max(this._clipY, ay);
    const bx2 = Math.min(this._clipX + this._clipW, ax + (w ?? 0));
    const by2 = Math.min(this._clipY + this._clipH, ay + (h ?? 0));

    this._clipX = bx;
    this._clipY = by;
    this._clipW = Math.max(0, bx2 - bx);
    this._clipH = Math.max(0, by2 - by);

    this._applyClip();
    return this._clipW > 0 && this._clipH > 0 ? true : undefined;
  }

  private _applyClip(): void {
    this.ctx.restore();
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(this._clipX, this._clipY, this._clipW, this._clipH);
    this.ctx.clip();
  }

  origin(): void;
  origin(x: number, y: number): void;
  origin(x?: number, y?: number): void {
    if (x === undefined) {
      const prev = this._stack.pop();
      if (prev && prev.type === 'origin') {
        this._originX = prev.x;
        this._originY = prev.y;
      }
      return;
    }
    this._stack.push({ type: 'origin', x: this._originX, y: this._originY });
    this._originX += x;
    this._originY += (y ?? 0);
  }

  // ── Drawing ────────────────────────────────────────────────────────────────

  fillRectangle(color: string, x: number, y: number, w: number, h: number): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this._originX + x, this._originY + y, w, h);
  }

  blendRectangle(color: string, blend: number, x: number, y: number, w: number, h: number): void {
    this.ctx.save();
    this.ctx.globalAlpha = blend / 255;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this._originX + x, this._originY + y, w, h);
    this.ctx.restore();
  }

  drawPixel(color: string, x: number, y: number): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this._originX + x, this._originY + y, 1, 1);
  }

  drawBitmap(bits: MockBitmap, x: number, y: number, sx = 0, sy = 0, sw?: number, sh?: number): void {
    if (!bits) return;
    sw = sw ?? bits.width;
    sh = sh ?? bits.height;
    this.ctx.drawImage(bits._canvas, sx, sy, sw, sh, this._originX + x, this._originY + y, sw, sh);
  }

  drawMonochrome(
    bits: MockBitmap,
    fore: string | undefined,
    back: string | undefined,
    x: number,
    y: number,
    sx = 0,
    sy = 0,
    sw?: number,
    sh?: number
  ): void {
    if (!bits) return;
    sw = sw ?? bits.width;
    sh = sh ?? bits.height;

    const src = bits._imageData;
    const data = src.data;
    const stride = src.width * 4;

    const tmp = document.createElement('canvas');
    tmp.width = sw;
    tmp.height = sh;
    const tctx = tmp.getContext('2d')!;
    const out = tctx.createImageData(sw, sh);
    const od = out.data;

    for (let row = 0; row < sh; row++) {
      for (let col = 0; col < sw; col++) {
        const si = (sy + row) * stride + (sx + col) * 4;
        const bright = data[si] > 127;
        const color = bright ? fore : back;
        if (!color) continue;
        const [r, g, b] = parseCSSColor(color);
        const di = (row * sw + col) * 4;
        od[di] = r; od[di + 1] = g; od[di + 2] = b; od[di + 3] = 255;
      }
    }
    tctx.putImageData(out, 0, 0);
    this.ctx.drawImage(tmp, this._originX + x, this._originY + y);
  }

  drawGray(
    bits: MockBitmap,
    color: string,
    x: number,
    y: number,
    sx = 0,
    sy = 0,
    sw?: number,
    sh?: number,
    blend = 255
  ): void {
    if (!bits) return;
    sw = sw ?? bits.width;
    sh = sh ?? bits.height;

    const src = bits._imageData;
    const data = src.data;
    const stride = src.width * 4;
    const [r, g, b] = parseCSSColor(color);
    const blendF = blend / 255;

    const tmp = document.createElement('canvas');
    tmp.width = sw;
    tmp.height = sh;
    const tctx = tmp.getContext('2d')!;
    const out = tctx.createImageData(sw, sh);
    const od = out.data;

    for (let row = 0; row < sh; row++) {
      for (let col = 0; col < sw; col++) {
        const si = (sy + row) * stride + (sx + col) * 4;
        const alpha = (data[si] / 255) * blendF;
        const di = (row * sw + col) * 4;
        od[di] = r; od[di + 1] = g; od[di + 2] = b;
        od[di + 3] = Math.round(alpha * 255);
      }
    }
    tctx.putImageData(out, 0, 0);
    this.ctx.drawImage(tmp, this._originX + x, this._originY + y);
  }

  drawMasked(
    bits: MockBitmap,
    x: number,
    y: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    mask: MockBitmap,
    mask_sx: number,
    mask_sy: number,
    blend = 255
  ): void {
    if (!bits || !mask) return;

    const imgData = bits._imageData;
    const maskData = mask._imageData;
    const iStride = imgData.width * 4;
    const mStride = maskData.width * 4;
    const blendF = blend / 255;

    const tmp = document.createElement('canvas');
    tmp.width = sw;
    tmp.height = sh;
    const tctx = tmp.getContext('2d')!;
    const out = tctx.createImageData(sw, sh);
    const od = out.data;
    const id = imgData.data;
    const md = maskData.data;

    for (let row = 0; row < sh; row++) {
      for (let col = 0; col < sw; col++) {
        const ii = (sy + row) * iStride + (sx + col) * 4;
        const mi = (mask_sy + row) * mStride + (mask_sx + col) * 4;
        const alpha = (md[mi] / 255) * blendF;
        const di = (row * sw + col) * 4;
        od[di] = id[ii]; od[di + 1] = id[ii + 1]; od[di + 2] = id[ii + 2];
        od[di + 3] = Math.round(alpha * 255);
      }
    }
    tctx.putImageData(out, 0, 0);
    this.ctx.drawImage(tmp, this._originX + x, this._originY + y);
  }

  fillPattern(bits: MockBitmap, x: number, y: number, w: number, h: number, sx = 0, sy = 0, sw?: number, sh?: number): void {
    if (!bits) return;
    sw = sw ?? bits.width;
    sh = sh ?? bits.height;

    const pat = document.createElement('canvas');
    pat.width = sw;
    pat.height = sh;
    pat.getContext('2d')!.drawImage(bits._canvas, sx, sy, sw, sh, 0, 0, sw, sh);

    const pattern = this.ctx.createPattern(pat, 'repeat')!;
    this.ctx.save();
    this.ctx.translate(this._originX + x, this._originY + y);
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, w, h);
    this.ctx.restore();
  }

  // ── Text ───────────────────────────────────────────────────────────────────

  getTextWidth(text: string, font: MockFont): number {
    let width = 0;
    let lastId = -1;

    for (const ch of [...text]) {
      const id = ch.codePointAt(0)!;
      const fntChar = font.charMap.get(id);
      if (!fntChar) { lastId = -1; continue; }

      if (lastId >= 0) {
        const kern = font.kerningMap.get(`${lastId},${id}`);
        if (kern) width += kern;
      }

      width += fntChar.xadvance;
      lastId = id;
    }

    return width;
  }

  drawText(text: string, font: MockFont, color: string, x: number, y: number, width?: number): void {
    if (width !== undefined) {
      const totalW = this.getTextWidth(text, font);
      if (totalW > width) {
        const ellipsis = '…';
        const ellW = this.getTextWidth(ellipsis, font);
        let truncated = '';
        let w = 0;
        for (const ch of [...text]) {
          const id = ch.codePointAt(0)!;
          const fntChar = font.charMap.get(id);
          const cw = fntChar ? fntChar.xadvance : 0;
          if (w + cw + ellW > width) break;
          truncated += ch;
          w += cw;
        }
        text = truncated + ellipsis;
      }
    }

    let cx = this._originX + x;
    const cy = this._originY + y;
    let lastId = -1;

    for (const ch of [...text]) {
      const id = ch.codePointAt(0)!;
      const fntChar = font.charMap.get(id);
      if (!fntChar) { lastId = -1; continue; }

      if (lastId >= 0) {
        const kern = font.kerningMap.get(`${lastId},${id}`);
        if (kern) cx += kern;
      }

      this._drawFntChar(fntChar, font, color, cx, cy);
      cx += fntChar.xadvance;
      lastId = id;
    }
  }

  private _drawFntChar(char: FntChar, font: MockFont, color: string, x: number, y: number): void {
    if (char.width === 0 || char.height === 0) return;

    const tmp = document.createElement('canvas');
    tmp.width = char.width;
    tmp.height = char.height;
    const tmpCtx = tmp.getContext('2d')!;
    tmpCtx.drawImage(font.atlas, char.x, char.y, char.width, char.height, 0, 0, char.width, char.height);

    if (font.isGrayAtlas) {
      // Grayscale atlas: luminance was converted to alpha; colorize with the requested color.
      tmpCtx.globalCompositeOperation = 'source-in';
      tmpCtx.fillStyle = color;
      tmpCtx.fillRect(0, 0, char.width, char.height);
    }
    // Color atlas: draw raw atlas pixels as-is; text color is not applied.

    this.ctx.drawImage(tmp, x + char.xoffset, y + char.yoffset);
  }

  // ── Frame ──────────────────────────────────────────────────────────────────

  drawFrame(frame: unknown, dictionary: { width?: number; height?: number }, x: number, y: number): void {
    const w = dictionary.width ?? 40;
    const h = dictionary.height ?? 40;
    this.ctx.save();
    this.ctx.strokeStyle = 'rgb(0,0,0)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(this._originX + x + 0.5, this._originY + y + 0.5, w - 1, h - 1);
    this.ctx.fillStyle = 'rgb(200,200,200)';
    this.ctx.fillRect(this._originX + x + 1, this._originY + y + 1, w - 2, h - 2);
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.font = '10px sans-serif';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('frame', this._originX + x + 4, this._originY + y + h / 2);
    this.ctx.restore();
  }
}

// PNG and BMP are both handled in resourceBMP
const resourcesBMP = new Map<string, MockBitmap>();
const resourcesBMF = new Map<string, FntFont>();

export class MockResource {
  static setBMP(fileName: string, bitmap: MockBitmap) {
    if (!(fileName.endsWith('.bmp') || fileName.endsWith('.png'))) {
      throw new Error(`setBMP only accepts ".png" and ".bmp"`);
    }
    // Scripts always reference with `.bmp` extension
    resourcesBMP.set(fileName.replace('.png', '.bmp'), bitmap);
  }

  static setBMF(fileName: string, buffer: ArrayBuffer | Uint8Array<ArrayBufferLike>) {
    if (!fileName.endsWith('.fnt')) {
      throw new Error(`setBMP only accepts ".fnt"`);
    }
    resourcesBMF.set(fileName, readFnt(buffer));
  }

  // if you've already stored the json
  static setBMFJSON(fileName: string, json: FntFont) {
    if (!fileName.endsWith('.fnt')) {
      throw new Error(`setBMP only accepts ".fnt"`);
    }
    resourcesBMF.set(fileName, json);
  }

  #file;
  constructor(fileName: string) {
    if (!(resourcesBMP.has(fileName) || resourcesBMF.has(fileName))) {
      throw new Error(`Unknown mock resource "${fileName}". Add with Resource.set(fileName, MockBitmap.create()).`);
    }
    this.#file = fileName;
  }

  get file() {
    return this.#file;
  }
}

export function MockParseBMP(buffer: MockResource) {
  // this is a mock, so lookup stored file key
  return resourcesBMP.get(buffer.file);
}

export function MockParseBMF(buffer: MockResource) {
  // this is a mock, so lookup stored file key
  return MockFont.from(resourcesBMF.get(buffer.file)!);
}
