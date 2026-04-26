export const demos = [
  {
    label: "fillRectangle",
    detail: "poco.fillRectangle(color, x, y, w, h) — fills a solid rectangle.",
    run({ poco }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      const cols = 8, rows = 5, pw = 48, ph = 46;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const color = ((r + c) % 2 === 0) ? black : white;
          poco.fillRectangle(color, c * pw, r * ph, pw - 1, ph - 1);
        }
      poco.end();
    }
  },
  {
    label: "blendRectangle",
    detail: "poco.blendRectangle(color, blend, x, y, w, h) — blends color over background. blend 0=transparent, 255=opaque.",
    run({ poco }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      const steps = 16;
      const sw = Math.floor(poco.width / steps);
      for (let i = 0; i < steps; i++) {
        const blend = Math.round((i + 1) * (255 / steps));
        poco.blendRectangle(black, blend, i * sw, 0, sw, poco.height);
      }
      poco.end();
    }
  },
  {
    label: "drawPixel",
    detail: "poco.drawPixel(color, x, y) — draws one pixel at a time.",
    run({ poco }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      for (let i = 0; i < Math.min(poco.width, poco.height); i += 2)
        poco.drawPixel(black, i, i);
      for (let i = 0; i < 600; i++) {
        const x = Math.floor(Math.random() * poco.width);
        const y = Math.floor(Math.random() * poco.height);
        poco.drawPixel(black, x, y);
      }
      poco.end();
    }
  },
  {
    label: "drawBitmap",
    detail: "poco.drawBitmap(bits, x, y [,sx,sy,sw,sh]) — draws a full or partial bitmap.",
    run({ poco, parseBMP, Resource }) {
      const white = poco.makeColor(255, 255, 255);
      const colorBitmap = parseBMP(new Resource("colorBitmap.bmp"));
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      poco.drawBitmap(colorBitmap, 10, 10);
      poco.drawBitmap(colorBitmap, 70, 10, 0, 0, 20, 20);
      for (let x = 0; x < poco.width; x += 42)
        poco.drawBitmap(colorBitmap, x, poco.height - 42);
      poco.end();
    }
  },
  {
    label: "drawMonochrome",
    detail: "poco.drawMonochrome(bits, fore, back, x, y) — draws 1-bit bitmap with explicit fore/back colors (undefined = skip that layer).",
    run({ poco, parseBMP, Resource }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      const monoBitmap = parseBMP(new Resource("monoBitmap.bmp"));
      poco.begin();
      poco.fillRectangle(black, 0, 0, poco.width, poco.height);
      poco.drawMonochrome(monoBitmap, black, white,     10,  10);
      poco.drawMonochrome(monoBitmap, black, undefined, 60,  10);
      poco.drawMonochrome(monoBitmap, undefined, black, 110, 10);
      poco.drawMonochrome(monoBitmap, white, black,     160, 10);
      poco.end();
    }
  },
  {
    label: "drawGray",
    detail: "poco.drawGray(bits, color, x, y [,sx,sy,sw,sh,blend]) — pixel brightness as alpha, blending color onto background.",
    run({ poco, parseBMP, Resource }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      const grayBitmap = parseBMP(new Resource("grayBitmap.bmp"));
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      for (let i = 0; i < 5; i++) {
        const blend = Math.round(((i + 1) / 5) * 255);
        poco.drawGray(grayBitmap, black, 10 + i * 75, 20, 0, 0, 32, 32, blend);
      }
      poco.fillRectangle(black, 0, 110, poco.width, 60);
      for (let i = 0; i < 5; i++) {
        const blend = Math.round(((i + 1) / 5) * 255);
        poco.drawGray(grayBitmap, white, 10 + i * 75, 114, 0, 0, 32, 32, blend);
      }
      poco.end();
    }
  },
  {
    label: "drawMasked",
    detail: "poco.drawMasked(bits, x, y, sx, sy, sw, sh, mask, msx, msy [,blend]) — alpha-blends a bitmap through a gray-16 mask.",
    run({ poco, parseBMP, Resource }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      const colorBitmap = parseBMP(new Resource("colorBitmap.bmp"));
      const circleMask = parseBMP(new Resource("circleMask.bmp"));
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      poco.drawMasked(colorBitmap, 10,  10, 0, 0, 40, 40, circleMask, 0, 0);
      poco.drawMasked(colorBitmap, 60,  10, 0, 0, 40, 40, circleMask, 0, 0, 128);
      poco.drawMasked(colorBitmap, 110, 10, 0, 0, 40, 40, circleMask, 0, 0, 64);
      poco.fillRectangle(black, 0, 80, poco.width, 80);
      poco.drawMasked(colorBitmap, 10, 90, 0, 0, 40, 40, circleMask, 0, 0);
      poco.drawMasked(colorBitmap, 60, 90, 0, 0, 40, 40, circleMask, 0, 0, 180);
      poco.end();
    }
  },
  {
    label: "fillPattern",
    detail: "poco.fillPattern(bits, x, y, w, h [,sx,sy,sw,sh]) — tiles a bitmap region to fill an area.",
    run({ poco, parseBMP, Resource }) {
      const patternBitmap = parseBMP(new Resource("patternBitmap.bmp"));
      poco.begin();
      poco.fillPattern(patternBitmap, 0, 0, poco.width, poco.height);
      poco.fillPattern(patternBitmap, 100, 60, 200, 120, 10, 10, 10, 10);
      poco.end();
    }
  },
  {
    label: "drawText",
    detail: "poco.drawText(text, font, color, x, y [,width]) — draws text using MyFont bitmap font; optional width truncates with '…'.",
    run({ poco, parseBMF, parseBMP, Resource }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      const myFont = parseBMF(new Resource("myFont.fnt"));
      myFont.bitmap = parseBMP(new Resource("myFont.bmp"));
      poco.begin();
      poco.fillRectangle(black, 0, 0, poco.width, poco.height);
      poco.drawText("Hello, Poco!", myFont, white, 10, 10);
      poco.drawText("MyFont bitmap font.", myFont, black, 10, 10 + myFont.height + 4);
      poco.fillRectangle(white, 0, 80, poco.width, 1);
      poco.drawText("This text is too long to fit without truncation.", myFont, black, 10, 90, 195);
      poco.drawText("Full width fits fine.", myFont, black, 10, 90 + myFont.height + 4, poco.width - 20);
      poco.end();
    }
  },
  {
    label: "getTextWidth",
    detail: "poco.getTextWidth(text, font) — measures pixel width using MyFont glyph metrics; used here to center and right-align strings.",
    run({ poco, parseBMF, parseBMP, Resource }) {
      const black = poco.makeColor(0, 0, 0);
      const myFont = parseBMF(new Resource("myFont.fnt"));
      myFont.bitmap = parseBMP(new Resource("myFont.bmp"));
      poco.begin();
      poco.fillRectangle(black, 0, 0, poco.width, poco.height);
      poco.drawText("Top Left", myFont, black, 4, 4);
      const trW = poco.getTextWidth("Top Right", myFont);
      poco.drawText("Top Right", myFont, black, poco.width - 4 - trW, 4);
      const cW = poco.getTextWidth("Center", myFont);
      poco.drawText("Center", myFont, black, (poco.width - cW) / 2, (poco.height - myFont.height) / 2);
      poco.drawText("Bot Left", myFont, black, 4, poco.height - 4 - myFont.height);
      const brW = poco.getTextWidth("Bot Right", myFont);
      poco.drawText("Bot Right", myFont, black, poco.width - 4 - brW, poco.height - 4 - myFont.height);
      poco.end();
    }
  },
  {
    label: "clip",
    detail: "poco.clip(x,y,w,h) / poco.clip() — push/pop intersecting clip rectangles.",
    run({ poco }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      const gray   = poco.makeColor(180, 180, 180);
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      poco.clip(20, 20, poco.width - 40, poco.height - 40);
      poco.fillRectangle(gray, 0, 0, poco.width, poco.height);
      poco.clip(20, 20, 160, 100);
      poco.fillRectangle(black, 0, 0, poco.width, poco.height);
      poco.clip();
      poco.fillRectangle(black, poco.width / 2 - 1, 0, 2, poco.height);
      poco.clip();
      poco.fillRectangle(black, 0, 0, 18, poco.height);
      poco.end();
    }
  },
  {
    label: "origin",
    detail: "poco.origin(x,y) / poco.origin() — push/pop drawing origin offsets.",
    run({ poco }) {
      const black = poco.makeColor(0, 0, 0);
      const white = poco.makeColor(255, 255, 255);
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      poco.origin(10, 10);
      poco.fillRectangle(black, 0, 0, 60, 40);
      poco.origin(70, 0);
      poco.fillRectangle(black, 0, 0, 60, 40);
      poco.origin(0, 50);
      poco.fillRectangle(black, 0, 0, 60, 40);
      poco.origin();
      poco.origin();
      poco.origin();
      poco.fillRectangle(black, poco.width - 20, poco.height - 20, 20, 20);
      poco.end();
    }
  },
  {
    label: "drawFrame",
    detail: "poco.drawFrame(frame, {width, height}, x, y) — renders a ColorCell compressed image (placeholder in this mock).",
    run({ poco }) {
      const white = poco.makeColor(255, 255, 255);
      poco.begin();
      poco.fillRectangle(white, 0, 0, poco.width, poco.height);
      poco.drawFrame(null, { width: 80,  height: 60 }, 10,  10);
      poco.drawFrame(null, { width: 120, height: 80 }, 110, 10);
      poco.drawFrame(null, { width: 50,  height: 50 }, 10,  80);
      poco.end();
    }
  },
];
