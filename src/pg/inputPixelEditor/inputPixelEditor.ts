import { Component, Prop, Part, normalizeInt, normalizeBoolean } from '@pictogrammers/element';

import template from './inputPixelEditor.html';
import style from './inputPixelEditor.css';
import { InputMode } from './utils/inputMode';
import cloneGrid from './utils/cloneGrid';
import getEllipsePixels from './utils/getEllipsePixels';
import getEllipseOutlinePixels from './utils/getEllipseOutlinePixels';
import { WHITE, Pixel } from './utils/constants';
import getLinePixels from './utils/getLinePixels';
import getRectanglePixels from './utils/getRectanglePixels';
import getRectangleOutlinePixels from './utils/getRectangleOutlinePixels';
import fillGrid from './utils/fillGrid';
import iterateGrid from './utils/interateGrid';
import bitmaskToPath from './utils/bitmapToMask';
import createLayer from './utils/createLayer';
import diffGrid from './utils/diffGrid';
import { getGuides } from './utils/getGuides';
import { getOutline } from './utils/getOutline';
import { getGridColorIndexes } from './utils/getGridColorIndexes';
import { getFloodFill } from './utils/getFloodFill';
import { readMetadata, textEncode, writeMetadata } from './utils/pngMetadata';
import { canvasToPngBuffer } from './utils/canvasToPngBuffer';
import { blobToImage } from './utils/blobToImage';

type Color = [number, number, number, number];

enum HistoryType {
  Group,
  Pixel,
  ColorUpdate,
  ColorAdd,
  ColorRemove,
  LayerAdd,
  LayerRemove,
  LayerName,
  LayerLock,
  LayerUnlock,
  LayerExport,
  LayerVisible,
  LayerOpacity
}

type HistoryGroupType = {
  name: string
}

type HistoryPixelType = {
  pixels: [number, number, number][],
  layer: number
}

type HistoryColorUpdateType = {
  color: Color,
  index: number
}

type HistoryItem = {
  type: HistoryType,
  data: HistoryGroupType | HistoryPixelType | HistoryColorUpdateType
}

type History = HistoryItem[];

type Layer = {
  name: string,
  visible: boolean,
  locked: boolean,
  opacity: number,
  export: boolean
}

interface FileOptions {
  history?: boolean
}

interface File {
  width: number
  height: number
  transparent: boolean
  colors: Color[]
  layers: Layer[]
  data: number[][][]
  undo?: History[]
  redo?: History[]
}

interface Export {
  scale?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

function toColor([r, g, b, a]: Color) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

@Component({
  selector: 'pg-input-pixel-editor',
  style,
  template
})
export default class PgInputPixelEditor extends HTMLElement {
  @Prop(normalizeInt) width: number = 10;
  @Prop(normalizeInt) height: number = 10;
  @Prop(normalizeInt) size: number = 10;
  @Prop(normalizeInt) gridSize: number = 1;
  @Prop(normalizeBoolean) transparent: boolean = false;
  @Prop() placeholder: string = '';

  @Part() $wrapper: HTMLDivElement;
  @Part() $canvas: HTMLCanvasElement;
  @Part() $selection: SVGSVGElement;
  @Part() $selectionPath: SVGPathElement;
  @Part() $selectionPathPreview: SVGPathElement;

  // Internal State
  #inputStamp: number[][] = [];
  #inputMode: InputMode = InputMode.Pixel;
  #isPressed: boolean = false;
  #isEditing: boolean = false;
  #startColor: number = -1;
  #startX: number = -1;
  #startY: number = -1;
  #x: number = -1;
  #y: number = -1;
  #layer: number[] = [0];
  #layers: Layer[] = [];
  #isCtrl: boolean = false;
  #isShift: boolean = false;
  #isAlt: boolean = false;
  #data: number[][][] = [];
  #selectionPreview: number[][] = [];
  #selectionPixels = new Map<string, number[]>(); // 'x,y', [x, y]
  #selection: number[][] = [];
  #export: number[][] = [];
  #undoHistory: History[] = [];
  #redoHistory: History[] = [];
  #context: CanvasRenderingContext2D;
  #color: number = 1;
  #colors: Color[] = [
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [255, 0, 255, 1]
  ];
  #baseLayer: HTMLCanvasElement;
  #baseLayerContext: CanvasRenderingContext2D;
  #editLayer: HTMLCanvasElement;
  #editLayerContext: CanvasRenderingContext2D;
  #noEditLayer: HTMLCanvasElement;
  #noEditLayerContext: CanvasRenderingContext2D;
  #previewLayer: HTMLCanvasElement;
  #previewLayerContext: CanvasRenderingContext2D;

  connectedCallback() {
    // Init
    const context = this.$canvas.getContext('2d');
    if (context === null) { return; }
    this.#context = context;
    // Wire Up Events
    this.$canvas.addEventListener(
      'contextmenu',
      this.handleContextMenu.bind(this)
    );
    this.$canvas.addEventListener(
      'doubleclick',
      this.handleDoubleClick.bind(this)
    );
    this.$canvas.addEventListener(
      'pointerdown',
      this.handlePointerDown.bind(this)
    );
    this.$canvas.addEventListener(
      'pointerenter',
      this.handlePointerEnter.bind(this)
    );
    this.$canvas.addEventListener(
      'pointerleave',
      this.handlePointerLeave.bind(this)
    );
    this.$wrapper.addEventListener(
      'focus',
      this.handleFocus.bind(this)
    );
    this.$wrapper.addEventListener(
      'blur',
      this.handleBlur.bind(this)
    );
    this.$wrapper.addEventListener(
      'keypress',
      this.handleKeyPress.bind(this)
    );
    this.$wrapper.addEventListener(
      'keydown',
      this.handleKeyDown.bind(this)
    );
    this.$wrapper.addEventListener(
      'keyup',
      this.handleKeyUp.bind(this)
    );
    this.$wrapper.addEventListener('paste', async (e: any) => {
      e.preventDefault();
      const clipboardContents = await navigator.clipboard.read();
      for (const item of clipboardContents) {
        if (item.types.includes("image/png")) {
          const pngBlob = await item.getType('image/png');
          console.log('read', pngBlob.size);
          const arrayBuffer = await pngBlob.arrayBuffer();
          console.log(readMetadata(new Uint8Array(arrayBuffer)));
        }
        if (item.types.includes('web application/easel+json')) {
          const textBlob = await item.getType('web application/easel+json');
          const text = await textBlob.text();
          console.log('Text content:', text);
        }
      }
    });
  }

  render(changes) {
    if (changes.width || changes.height || changes.size || changes.transparent) {
      this.#init();
    }
  }

  #reset = true;
  #init() {
    const totalSize = this.size + this.gridSize;
    const actualWidth = this.width * totalSize - this.gridSize;
    const actualHeight = this.height * totalSize - this.gridSize;
    this.$canvas.width = actualWidth;
    this.$canvas.height = actualHeight;
    this.#context.clearRect(0, 0, actualWidth, actualHeight);
    [this.#baseLayer, this.#baseLayerContext] = createLayer(actualWidth, actualHeight);
    [this.#editLayer, this.#editLayerContext] = createLayer(actualWidth, actualHeight);
    [this.#noEditLayer, this.#noEditLayerContext] = createLayer(actualWidth, actualHeight);
    [this.#previewLayer, this.#previewLayerContext] = createLayer(actualWidth, actualHeight);
    if (this.transparent) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.#baseLayerContext.fillStyle = WHITE;
          this.#baseLayerContext.fillRect(x * totalSize, y * totalSize, this.size + 1, this.size + 1);
          this.#baseLayerContext.fillStyle = '#DDD';
          this.#baseLayerContext.fillRect(x * totalSize + Math.ceil(this.size / 2), y * totalSize, Math.floor(this.size / 2), Math.floor(this.size / 2));
          this.#baseLayerContext.fillRect(x * totalSize, y * totalSize + Math.floor(this.size / 2), Math.ceil(this.size / 2), Math.ceil(this.size / 2));
        }
      }
    } else {
      this.#baseLayerContext.clearRect(0, 0, actualWidth, actualHeight);
    }
    this.$selection.setAttribute('viewBox', `0 0 ${this.width * this.size} ${this.height * this.size}`);
    if (this.#reset) {
      this.#layer = [0];
      this.#layers = [{
        name: 'Layer 1',
        export: true,
        locked: false,
        visible: true,
        opacity: 1
      }];
      this.#data = [fillGrid(this.width, this.height)];
      this.#export = fillGrid(this.width, this.height);
      this.#selectionPreview = fillGrid(this.width, this.height);
      this.#selection = fillGrid(this.width, this.height);
      this.#reset = false;
      this.#undoHistory = [];
      this.#redoHistory = [];
    } else {
      this.#redraw();
    }
    this.#updateGrid();
  }

  #redraw() {
    // Render individual pixels
    const data = this.#data.toReversed();
    const layerCount = data.length;
    for (let y = 0; y < this.height; y++) {
      if (y >= data[0].length) {
        for (let l = 0; l < layerCount; l++) {
          data[l].push(new Array(this.width).fill(0));
          this.#export.push(new Array(this.width).fill(0));
          this.#selection.push(new Array(this.width).fill(0));
          this.#selectionPreview.push(new Array(this.width).fill(0));
        }
      }
      for (let x = 0; x < this.width; x++) {
        if (x >= data[0][y].length) {
          for (let l = 0; l < layerCount; l++) {
            data[l][y].push(0);
            this.#export[y].push(0);
            this.#selection[y].push(0);
            this.#selectionPreview[y].push(0);
          }
        }
        for (let l = 0; l < layerCount; l++) {
          if (data[l][y][x] !== 0) {
            this.#setPixel(x, y, data[l][y][x]);
            break;
          }
        }
      }
    }
  }

  #handleChange() {
    // Due to perf, don't compute anything here
    // use this.$input.get... methods
    this.dispatchEvent(new CustomEvent('change', {
      detail: { export: this.#export }
    }));
  };

  #delayTimerId: number = 0;
  #delayedChange() {
    clearInterval(this.#delayTimerId);
    this.#delayTimerId = window.setTimeout(this.#handleChange.bind(this), 1000);
  };

  #previousPreview: Pixel[] = [];
  #setSelectionPreview(pixels: Pixel[]) {
    // Undo previous selection
    this.#previousPreview.forEach(({x, y}) => {
      this.#selectionPreview[y][x] = 0;
    });
    pixels.forEach(({ x, y }) => {
      this.#previousPreview = pixels;
      this.#selectionPreview[y][x] = 1;
    });
    this.$selectionPathPreview.classList.toggle('hide', false);
    this.$selectionPathPreview.setAttribute('d', bitmaskToPath(this.#selectionPreview, { scale: this.size }));
  }

  #clearSelectionPreview() {
    this.$selectionPathPreview.classList.toggle('hide', true);
    this.#previousPreview.forEach(({x, y}) => {
      this.#selectionPreview[y][x] = 0;
    });
  }

  clearSelection() {
    this.#selectionPixels.forEach(([x, y]) => {
      this.#selection[y][x] = 0;
    });
    this.#selectionPixels.clear();
    this.$selectionPath.classList.toggle('hide', true);
  }

  hasSelection() {
    return this.#selectionPixels.size !== 0;
  }

  /**
   * Get a JSON contents of the selected region
   */
  getSelection() {

  }

  #setSelectionPixel(x: number, y: number) {
    this.#selectionPixels.set(`${x},${y}`, [x, y]);
    this.#selection[y][x] = 1;
  }

  #setPixel(x: number, y: number, color: number) {
    if (x >= this.width || x < 0) {
      return;
      // throw new Error(`Invalid x; ${x} > ${this.width} or ${x} < 0`);
    }
    if (y >= this.height || y < 0) {
      return;
      // throw new Error(`Invalid y; ${y} > ${this.height} or ${x} < 0`);
    }
    const totalSize = this.size + this.gridSize;
    // Edit Layer
    this.#context.clearRect(x * totalSize, y * totalSize, this.size, this.size);
    this.#editLayerContext.clearRect(x * totalSize, y * totalSize, this.size, this.size);
    this.#noEditLayerContext.clearRect(x * totalSize, y * totalSize, this.size, this.size);
    // Edit layer
    if (this.#colors[color][3] !== 0) {
      this.#editLayerContext.fillStyle = WHITE;
      this.#editLayerContext.fillRect(
        x * totalSize - (this.gridSize) + 1,
        y * totalSize - (this.gridSize) + 1,
        this.size + (this.gridSize * 2) - 2,
        this.size + (this.gridSize * 2) - 2
      );
      this.#editLayerContext.fillStyle = toColor(this.#colors[color]);
      this.#editLayerContext.fillRect(x * totalSize + 1, y * totalSize + 1, this.size - 2, this.size - 2);
    }
    // No Edit layer
    if (this.#colors[color][3] !== 0) {
      this.#noEditLayerContext.fillStyle = toColor(this.#colors[color]);
      this.#noEditLayerContext.fillRect(x * totalSize, y * totalSize, this.size, this.size);
    }
    // base layer to main canvas
    this.#context.drawImage(
      this.#baseLayer,
      x * totalSize, y * totalSize, this.size + 2, this.size + 2,
      x * totalSize, y * totalSize, this.size + 2, this.size + 2
    );
    // editing layer to main canvas
    this.#context.drawImage(
      this.#isEditing ? this.#editLayer : this.#noEditLayer,
      x * totalSize, y * totalSize, this.size + 2, this.size + 2,
      x * totalSize, y * totalSize, this.size + 2, this.size + 2
    );
    // Verify this is the only place setting pixel data!
    this.#data[this.#layer[0]][y][x] = color;
    this.#updateExport(x, y);
    this.#delayedChange();
  }

  #setPixelAll() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.#setPixel(x, y, this.#data[this.#layer[0]][y][x]);
      }
    }
  }

  getExportLayerIndexes() {
    return this.#layers.reduce((arr: any, layer: any, index: number) => {
      if (layer.export) {
        arr.push(index);
      }
      return arr;
    }, []);
  }

  /**
   * Update cached export grid for performance.
   * @param x X
   * @param y Y
   */
  #updateExport(x: number, y: number) {
    let color = 0;
    let layers = this.getExportLayerIndexes();
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (this.#data[layer][y][x] !== 0) {
        color = this.#data[layer][y][x];
        break;
      }
    }
    this.#export[y][x] = color;
  }

  #setPreview(pixels: Pixel[], previousX: number, previousY: number) {
    const totalSize = this.size + this.gridSize;
    const actualWidth = this.width * totalSize - this.gridSize;
    const actualHeight = this.height * totalSize - this.gridSize;
    const { minX, maxX, minY, maxY } = pixels.reduce((previous, current) => {
      return {
        minX: Math.min(previous.minX, current.x, previousX),
        maxX: Math.max(previous.maxX, current.x, previousX),
        minY: Math.min(previous.minY, current.y, previousY),
        maxY: Math.max(previous.maxY, current.y, previousY)
      };
    }, { minX: this.width, maxX: 0, minY: this.height, maxY: 0 });
    const x = minX * totalSize;
    const y = minY * totalSize;
    const width = (maxX - minX + 1) * totalSize;
    const height = (maxY - minY + 1) * totalSize;
    this.#context.clearRect(x, y, width, height);
    // base layer to main canvas
    this.#context.drawImage(
      this.#baseLayer,
      x, y, width, height,
      x, y, width, height
    );
    // edit to main canvas
    this.#context.drawImage(
      this.#editLayer,
      x, y, width, height,
      x, y, width, height
    );
    // preview layer
    this.#previewLayerContext.clearRect(0, 0, actualWidth, actualHeight);
    pixels.forEach(({ x, y }) => {
      this.#previewLayerContext.fillStyle = WHITE;
      this.#previewLayerContext.beginPath();
      this.#previewLayerContext.arc(x * totalSize + 5, y * totalSize + 5, 3, 0, 2 * Math.PI);
      this.#previewLayerContext.closePath();
      this.#previewLayerContext.fill();
      this.#previewLayerContext.fillStyle = '#1B79C8';
      this.#previewLayerContext.beginPath();
      this.#previewLayerContext.arc(x * totalSize + 5, y * totalSize + 5, 2, 0, 2 * Math.PI);
      this.#previewLayerContext.closePath();
      this.#previewLayerContext.fill();
    });
    // preview layer to main canvas
    this.#context.drawImage(
      this.#previewLayer,
      x, y, width, height,
      x, y, width, height
    );
    // Debug
    this.dispatchEvent(new CustomEvent('debug', {
      detail: {
        x,
        y,
        width,
        height,
        canvas: this.$canvas,
        context: this.#context,
        editLayer: this.#editLayer,
        noEditLayer: this.#noEditLayer,
        baseLayer: this.#baseLayer,
        previewLayer: this.#previewLayer
      }
    }));
  }

  #previousPreviewRect = { x: 0, y: 0, width: 1, height: 1 };
  #clearStampPreview() {
    const { x, y, width, height } = this.#previousPreviewRect;
    this.#context.clearRect(x, y, width, height);
    // base layer to main canvas
    this.#context.drawImage(
      this.#baseLayer,
      x, y, width, height,
      x, y, width, height
    );
    // edit to main canvas
    this.#context.drawImage(
      this.#noEditLayer,
      x, y, width, height,
      x, y, width, height
    );
  }

  #setStampPreview(pixels: Pixel[], centerX: number, centerY: number, previousX: number, previousY: number) {
    const totalSize = this.size + this.gridSize;
    const { minX, maxX, minY, maxY } = pixels.reduce((previous, current) => {
      return {
        minX: Math.min(previous.minX, current.x, previousX),
        maxX: Math.max(previous.maxX, current.x, previousX),
        minY: Math.min(previous.minY, current.y, previousY),
        maxY: Math.max(previous.maxY, current.y, previousY)
      };
    }, { minX: this.width, maxX: 0, minY: this.height, maxY: 0 });
    const offsetX = previousX - centerX;
    const offsetY = previousY - centerY;
    const x = offsetX < 0 ? (minX + offsetX) * totalSize : minX * totalSize;
    const y = offsetY < 0 ? (minY + offsetY) * totalSize : minY * totalSize;
    const width = (maxX - minX + 1 + Math.abs(offsetX)) * totalSize;
    const height = (maxY - minY + 1 + Math.abs(offsetY)) * totalSize;
    this.#context.clearRect(x, y, width, height);
    // base layer to main canvas
    this.#context.drawImage(
      this.#baseLayer,
      x, y, width, height,
      x, y, width, height
    );
    // edit to main canvas
    this.#context.drawImage(
      this.#editLayer,
      x, y, width, height,
      x, y, width, height
    );
    // preview layer
    this.#previewLayerContext.clearRect(x, y, width, height);
    pixels.forEach(({ x, y }) => {
      this.#previewLayerContext.fillStyle = '#1B79C8';
      this.#previewLayerContext.fillRect(x * totalSize + 2, y * totalSize + 2, this.size - 4, this.size - 4);
    });
    this.#context.drawImage(
      this.#previewLayer,
      x, y, width, height,
      x, y, width, height
    );
    // Store to clear
    this.#previousPreviewRect = { x, y, width, height };
    // Debug
    this.dispatchEvent(new CustomEvent('debug', {
      detail: {
        x,
        y,
        width,
        height,
        canvas: this.$canvas,
        context: this.#context,
        editLayer: this.#editLayer,
        noEditLayer: this.#noEditLayer,
        baseLayer: this.#baseLayer,
        previewLayer: this.#previewLayer
      }
    }));
  }

  async copyPngToClipboard(blob, data) {
    try {
      // Ensure the blob is of type image/png if necessary
      // In many cases, the fetched blob's type is already correct
      if (blob.type !== "image/png") {
          console.error("Fetched resource is not a PNG image.");
          // Optional: convert to PNG using a canvas if needed
          // For conversion logic, see Stack Overflow links
          return;
      }

      // 3. Create a new ClipboardItem with the Blob
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob,
        'web application/easel+json': new Blob([JSON.stringify(data)], { type: 'web application/easel+json' }),
      });

      // 4. Write the ClipboardItem to the clipboard
      await navigator.clipboard.write([clipboardItem]);

    } catch (err) {
      console.error('Failed to copy image: ', err.name, err.message);
    }
  }

  handleFocus() {
    if(!this.$wrapper.matches(':focus-visible')) {
      this.$wrapper.classList.toggle('ignore', true);
    }
  }

  handleBlur() {
    this.$wrapper.classList.toggle('ignore', false);
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      event.preventDefault();
    }
  }

  async handleKeyDown(event: KeyboardEvent) {
    console.log(event.shiftKey, event.ctrlKey, event.altKey, event.key);
    this.#isShift = true;
    switch (event.key) {
      case ' ':
        // stop page scroll
        event.preventDefault();
        break;
      case 'Escape':
        console.log('escape');
        this.clearSelection();
        break;
      case 'Delete':
        this.#selectionPixels.forEach(([x, y]) => {
          this.#setPixel(x, y, 0);
        });
        this.clearSelection();
        break;
      case 'ArrowRight':
        if (this.hasSelection()) {
          this.moveSelection(1, 0);
        }
        break;
    }
    if (event.ctrlKey) {
      switch (event.key) {
        case 'c':
          if (this.hasSelection()) {
            const image = await this.getSelectionPng();
            this.copyPngToClipboard(image, { x: 2, y: 2 });
          } else {
            const image = await this.getExportPng();
            this.copyPngToClipboard(image, {});
          }
          break;
        case 'z':
          if (event.shiftKey) {
            // modern redo keybinding
            this.redo();
          } else {
            this.undo();
          }
          break;
        case 'y':
          // legacy redo keybinding
          this.redo();
          break;
      }
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    this.#isShift = false;
  }

  handleContextMenu(event: MouseEvent) {
    event?.preventDefault();
  }

  handleDoubleClick(event: MouseEvent) {
    event?.preventDefault();
  }

  #handlePointerMoveCache;
  #handlePointerUpCache;

  handlePointerDown(event: MouseEvent) {
    if (event.buttons !== 1 && event.buttons !== 32) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    // Update Modifiers
    this.#isAlt = event.altKey;
    this.#isCtrl = event.ctrlKey;
    this.#isShift = event.shiftKey;
    // Drawing
    const rect = this.$canvas.getBoundingClientRect();
    const totalSize = this.size + this.gridSize;
    let newX = Math.floor((event.clientX - rect.left) / totalSize);
    let newY = Math.floor((event.clientY - rect.top) / totalSize);
    if (newX === this.#x && newY === this.#y) { return; }
    if (newX >= this.width) { newX = this.width - 1; }
    if (newY >= this.height) { newY = this.height - 1; }
    this.#isPressed = true;
    this.#startColor = this.#data[this.#layer[0]][newY][newX];
    this.#startX = newX;
    this.#startY = newY;
    this.#x = newX;
    this.#y = newY;
    const color = event.buttons === 32 ? 0 : this.#color;
    switch (this.#inputMode) {
      case InputMode.Pixel:
        this.#setPixel(newX, newY, color);
        break;
      case InputMode.Stamp:
        this.#inputStamp.forEach((point) => {
          this.#setPixel(newX + point[0], newY + point[1], color);
        });
        break;
    }
    // track movement
    this.#handlePointerMoveCache = this.handlePointerMove.bind(this);
    document.addEventListener('pointermove', this.#handlePointerMoveCache);
    // pointer outside
    this.#handlePointerUpCache = this.handlePointerUp.bind(this);
    document.addEventListener('pointerup', this.#handlePointerUpCache);
  }

  #pointerOutside = false;

  cleanupPointerGlobal() {
    document.removeEventListener('pointermove', this.#handlePointerMoveCache);
    document.removeEventListener('pointerup', this.#handlePointerUpCache);
  }

  handlePointerUp(event: MouseEvent) {
    const rect = this.$canvas.getBoundingClientRect();
    const totalSize = this.size + this.gridSize;
    let newX = Math.floor((event.clientX - rect.left) / totalSize);
    let newY = Math.floor((event.clientY - rect.top) / totalSize);
    //if (newX >= this.width) { newX = this.width - 1; }
    //if (newY >= this.height) { newY = this.height - 1; }
    //if (this.#startX === -1 && this.#startY === -1) {
    //  return;
    //}
    // Single Tap
    if (newX === this.#startX && newY === this.#startY) {
      switch (this.#inputMode) {
        case InputMode.SelectMagicWand:
          if (!event.shiftKey) {
            this.clearSelection();
          }
          const color = this.#data[this.#layer[0]][newY][newX];
          console.log(color);
          const pixels = getFloodFill(this.#data[this.#layer[0]], newX, newY, [color]);
          pixels.forEach(([x, y]) => {
            this.#setSelectionPixel(x, y);
          });
          this.$selectionPathPreview.classList.toggle('hide', true);
          this.$selectionPath.classList.toggle('hide', false);
          this.$selectionPath.setAttribute('d', bitmaskToPath(this.#selection, { scale: this.size }));
          break;
        case InputMode.Pixel:
          if (this.#startColor === 1) {
            this.#setPixel(newX, newY, 0);
            this.#data[this.#layer[0]][newY][newX] = 0;
          }
          break;
        case InputMode.Stamp:
          if (this.#startColor === 1) {
            this.#inputStamp.forEach((point) => {
              this.#setPixel(newX + point[0], newY + point[1], 0);
            });
          }
          break;
      }
    } else {
      switch (this.#inputMode) {
        case InputMode.SelectRectangle:
          this.#clearSelectionPreview();
          if (!event.shiftKey) {
            this.clearSelection();
          }
          getRectanglePixels(this.#startX, this.#startY, newX, newY).forEach(({ x, y }) => {
            this.#setSelectionPixel(x, y);
          });
          this.$selectionPathPreview.classList.toggle('hide', true);
          this.$selectionPath.classList.toggle('hide', false);
          this.$selectionPath.setAttribute('d', bitmaskToPath(this.#selection, { scale: this.size }));
          break;
        case InputMode.SelectEllipse:
          this.#clearSelectionPreview();
          if (!event.shiftKey) {
            this.clearSelection();
          }
          getEllipsePixels(this.#startX, this.#startY, newX, newY).forEach(({ x, y }) => {
            this.#setSelectionPixel(x, y);
          });
          this.$selectionPathPreview.classList.toggle('hide', true);
          this.$selectionPath.classList.toggle('hide', false);
          this.$selectionPath.setAttribute('d', bitmaskToPath(this.#selection, { scale: this.size }));
          break;
        case InputMode.SelectLasso:

          break;
        case InputMode.Line:
          getLinePixels(this.#startX, this.#startY, newX, newY).forEach(({ x, y }) => {
            this.#setPixel(x, y, 1);
          });
          break;
        case InputMode.Rectangle:
          getRectanglePixels(this.#startX, this.#startY, newX, newY).forEach(({ x, y }) => {
            this.#setPixel(x, y, 1);
          });
          break;
        case InputMode.RectangleOutline:
          getRectangleOutlinePixels(this.#startX, this.#startY, newX, newY).forEach(({ x, y }) => {
            this.#setPixel(x, y, 1);
          });
          break;
        case InputMode.Ellipse:
          getEllipsePixels(this.#startX, this.#startY, newX, newY).forEach(({ x, y }) => {
            this.#setPixel(x, y, 1);
          });
          break;
        case InputMode.EllipseOutline:
          getEllipseOutlinePixels(this.#startX, this.#startY, newX, newY).forEach(({ x, y }) => {
            this.#setPixel(x, y, 1);
          });
          break;
      }
    }
    this.#x = -1;
    this.#y = -1;
    this.#isPressed = false;
    this.cleanupPointerGlobal();
    if (this.#pointerOutside) {
      this.#isEditing = false;
      // base layer to main canvas
      this.#context.drawImage(this.#baseLayer, 0, 0);
      // editing layer to main canvas
      this.#context.drawImage(this.#isEditing ? this.#editLayer : this.#noEditLayer, 0, 0);
    }
  }

  handlePointerMove(event: PointerEvent) {
    const canvas = this.$canvas;
    if (this.#isPressed) {
      this.#isAlt = event.altKey;
      this.#isCtrl = event.ctrlKey;
      this.#isShift = event.shiftKey;
      const data = this.#data;
      const rect = canvas.getBoundingClientRect();
      const totalSize = this.size + this.gridSize;
      const points: [number, number][] = [];
      const startX = this.#startX;
      const startY = this.#startY;
      const x = this.#x;
      const y = this.#y;
      // If supported get all the inbetween points
      // really noticable for pen support + pencil tool
      if (typeof event.getCoalescedEvents === 'function') {
        const events = event.getCoalescedEvents();
        for (const evt of events) {
          let tX = Math.floor((evt.clientX - rect.left) / totalSize);
          let tY = Math.floor((evt.clientY - rect.top) / totalSize);
          if (tX === x && tY === y) {
            continue;
          }
          points.push([tX, tY]);
        }
      } else {
        let newX = Math.floor((event.clientX - rect.left) / totalSize);
        let newY = Math.floor((event.clientY - rect.top) / totalSize);
        if (newX === x && newY === y) { return; }
        points.push([newX, newY]);
      }
      // Is Eraser
      const color = event.buttons === 32 ? 0 : this.#color;
      // Shape tools only care about the last point
      if (points.length === 0) { return; }
      const [lastX, lastY] = points.at(-1) as [number, number];
      // This is not ideal, but might be good enough,
      // really it should be finding the point furthest absolute
      // point from startX/startY.
      this.#x = lastX;
      this.#y = lastY;
      switch (this.#inputMode) {
        case InputMode.SelectRectangle:
          this.#setSelectionPreview(getRectanglePixels(startX, startY, lastX, lastY));
          break;
        case InputMode.Pixel:
          for (var point of points) {
            this.#setPixel(point[0], point[1], color);
          }
          break;
        case InputMode.Stamp:
          for (var point of points) {
            this.#inputStamp.forEach((arr) => {
              this.#setPixel(point[0] + arr[0], point[1] + arr[1], color);
            });
          }
          break;
        case InputMode.Line:
          this.#setPreview(getLinePixels(startX, startY, lastX, lastY), x, y);
          break;
        case InputMode.Rectangle:
          this.#setPreview(getRectanglePixels(startX, startY, lastX, lastY), x, y);
          break;
        case InputMode.RectangleOutline:
          this.#setPreview(getRectangleOutlinePixels(startX, startY, lastX, lastY), x, y);
          break;
        case InputMode.Ellipse:
          this.#setPreview(getEllipsePixels(startX, startY, lastX, lastY), x, y);
          break;
        case InputMode.EllipseOutline:
          this.#setPreview(getEllipseOutlinePixels(startX, startY, lastX, lastY), x, y);
          break;
      }
    }
  }

  handlePointerEnter(event: MouseEvent) {
    if (!this.#isPressed && !this.#isEditing) {
      this.#isEditing = true;
      // base layer to main canvas
      this.#context.drawImage(this.#baseLayer, 0, 0);
      // editing layer to main canvas
      this.#context.drawImage(this.#isEditing ? this.#editLayer : this.#noEditLayer, 0, 0);
      // track pointer movement
      if (this.#inputMode === InputMode.Stamp) {
        this.#handlePointerMovePreviewCache = this.handlePointerMovePreview.bind(this);
        this.$canvas.addEventListener('pointermove', this.#handlePointerMovePreviewCache);
        this.#handlePointerLeavePreviewCache = this.handlePointerLeavePreview.bind(this);
        this.$canvas.addEventListener('pointerleave', this.#handlePointerLeavePreviewCache);
      }
    }
    this.#pointerOutside = false;
  }

  #moveX = -1;
  #moveY = -1;
  #handlePointerMovePreviewCache;
  handlePointerMovePreview(event: MouseEvent) {
    const rect = this.$canvas.getBoundingClientRect();
    const totalSize = this.size + this.gridSize;
    let newX = Math.floor((event.clientX - rect.left) / totalSize);
    let newY = Math.floor((event.clientY - rect.top) / totalSize);
    if (newX === this.#moveX && newY === this.#moveY) { return; }
    if (newX < 0 || newY < 0) { return; }
    this.#setStampPreview(
      this.#inputStamp.map(arr => ({ x: arr[0] + newX, y: arr[1] + newY })),
      newX,
      newY,
      this.#moveX === -1 ? newX : this.#moveX,
      this.#moveY === -1 ? newY : this.#moveY,
    );
    this.#moveX = newX;
    this.#moveY = newY;
  }

  #handlePointerLeavePreviewCache;
  handlePointerLeavePreview() {
    this.#clearStampPreview();
    this.$canvas.removeEventListener('pointermove', this.#handlePointerMovePreviewCache);
    this.$canvas.removeEventListener('pointerleave', this.#handlePointerLeavePreviewCache);
  }

  handlePointerLeave(event: MouseEvent) {
    if (!this.#isPressed) {
      this.#isEditing = false;
      // base layer to main canvas
      this.#context.drawImage(this.#baseLayer, 0, 0);
      // editing layer to main canvas
      this.#context.drawImage(this.#isEditing ? this.#editLayer : this.#noEditLayer, 0, 0);
      // remove preview tracking
      this.$canvas.removeEventListener('pointermove', this.#handlePointerMovePreviewCache);
    } else if (this.#isEditing) {
      this.#pointerOutside = true;
    }
  }

  #updateGrid() {
    // base layer to main canvas
    this.#context.drawImage(this.#baseLayer, 0, 0);
    // editing layer to main canvas
    this.#context.drawImage(this.#noEditLayer, 0, 0);
  }

  mergeColor(fromIndex: number, toIndex: number) {
    // ToDo: Code this
  }

  /**
   * ToDo: Delete this method
   */
  clear() {
    const gridEmpty = fillGrid(this.width, this.height);
    const diff = diffGrid(this.#data[this.#layer[0]], gridEmpty);
    this.#data = [fillGrid(this.width, this.height)];
    this.#export = fillGrid(this.width, this.height);
    this.#selectionPreview = fillGrid(this.width, this.height);
    this.#selection = fillGrid(this.width, this.height);
    this.#updateGrid();
  }

  reset() {
    this.#reset = true;
    this.#init();
  }

  clearHistory() {
    this.#undoHistory = [];
    this.#redoHistory = [];
  }

  getHistory() {
    return this.#undoHistory;
  }

  applyTemplate(template: number[][]) {
    this.#data = [template];
    this.#setPixelAll();
  }

  flipHorizontal() {
    const cloned = cloneGrid(this.#data[this.#layer[0]]);
    const w = cloned[0].length - 1;
    iterateGrid(this.#data[this.#layer[0]], (x, y) => {
      cloned[y][x] = this.#data[this.#layer[0]][y][w - x];
    });
    this.#data[this.#layer[0]] = cloned;
  }

  flipVertical() {
    const cloned = cloneGrid(this.#data[this.#layer[0]]);
    const h = cloned.length - 1;
    iterateGrid(this.#data[this.#layer[0]], (x, y) => {
      cloned[this.#layer[0]][y][x] = this.#data[h - y][x];
    });
    this.#data[this.#layer[0]] = cloned;
  }

  move(translateX: number, translateY: number) {
    const cloned = fillGrid(this.width, this.height);
    for (let iy = 0; iy < this.height; iy++) {
      cloned[iy].fill(0);
    }
    iterateGrid(this.#data[this.#layer[0]], (x, y) => {
      if (y - translateY < 0
        || x - translateX < 0
        || y - translateY >= this.height
        || x - translateX >= this.width) {
        return;
      }
      cloned[y][x] = this.#data[this.#layer[0]][y - translateY][x - translateX];
    });
    this.#data[this.#layer[0]] = cloned;
  }

  invert() {
    // Only works with 2 colors
    if (this.#colors.length > 2) {
      return;
    }
    iterateGrid(this.#data[this.#layer[0]], (x, y) => {
      this.#data[this.#layer[0]][y][x] = this.#data[this.#layer[0]][y][x] === 0 ? 1 : 0;
    });
    this.#setPixelAll();
  }

  applyGuides() {
    const guides = getGuides(this.width, this.height, this.size, this.gridSize);
    this.#baseLayerContext.drawImage(guides, 0, 0);
  }

  clearGuides() {

  }

  undo() {
    // ToDo: Rewrite to use new history api
    const historyItems = this.#undoHistory.pop();
    if (!historyItems) { return; }
    this.#redoHistory.push(historyItems);
    historyItems.forEach((historyItem) => {
      switch (historyItem.type) {
        case HistoryType.Pixel:
          (historyItem.data as HistoryPixelType).pixels.forEach((item) => {
            const [x, y] = item;
            this.#data[this.#layer[0]][y][x] = item[2];
            // redraw canvas
          });
          break;
      }
    });
  }

  redo() {
    // ToDo: Rewrite to use new history api
    /*const revert = this.#redoHistory.pop();
    if (!revert) { return; }
    this.#undoHistory.push(revert);
    revert?.forEach((item) => {
      const [x, y] = item;
      this.#data[y][x] = item[2];
      // redraw canvas
    });*/
  }

  rotateClockwise() {
    this.#rotate(false);
  }

  rotateCounterclockwise() {
    this.#rotate(true);
  }

  #rotate(counterClockwise: boolean = false) {
    const cloned = cloneGrid(this.#data[this.#layer[0]]);
    if (counterClockwise) {
      const newData = this.#data[0].map((val, index) => this.#data.map(row => row[row.length - 1 - index]));
      for (let iy = 0; iy < this.height; iy++) {
        for (let ix = 0; ix < this.width; ix++) {
          cloned[iy][ix] = newData[this.#layer[0]][iy][ix];
        }
      }
    } else {
      const newData = this.#data[0].map((val, index) => this.#data.map(row => row[index]).reverse());
      for (let iy = 0; iy < this.height; iy++) {
        for (let ix = 0; ix < this.width; ix++) {
          cloned[iy][ix] = newData[this.#layer[0]][iy][ix];
        }
      }
    }
    this.#data[this.#layer[0]] = cloned;
  }

  hasUndo() {
    return this.#undoHistory.length !== 0;
  }

  hasRedo() {
    return this.#redoHistory.length !== 0;
  }

  #inputModePixelSize = 1;
  inputModePixelSize(size = 1) {
    this.#inputModePixelSize = size;
  }

  inputModeStamp(stamp: number[][]) {
    this.#inputStamp = stamp;
    this.#inputMode = InputMode.Stamp;
    // Clear previous pixel
    this.#clearStampPreview();
  }

  inputModeSelectRectangle() {
    this.#inputMode = InputMode.SelectRectangle;
  }

  inputModeSelectEllipse() {
    this.#inputMode = InputMode.SelectEllipse;
  }

  inputModeSelectLasso() {
    this.#inputMode = InputMode.SelectLasso;
  }

  inputModeSelectMagicWand() {
    this.#inputMode = InputMode.SelectMagicWand;
  }

  inputModePixel() {
    this.#inputMode = InputMode.Pixel;
  }

  inputModeLine() {
    this.#inputMode = InputMode.Line;
  }

  inputModeRectangle() {
    this.#inputMode = InputMode.Rectangle;
  }

  inputModeRectangleOutline() {
    this.#inputMode = InputMode.RectangleOutline;
  }

  inputModeEllipse() {
    this.#inputMode = InputMode.Ellipse;
  }

  inputModeEllipseOutline() {
    this.#inputMode = InputMode.EllipseOutline;
  }

  async getJson(options: FileOptions = {}): Promise<File> {
    const file: File = {
      width: this.width,
      height: this.height,
      transparent: this.transparent,
      colors: this.#colors,
      layers: this.#layers,
      data: this.#data
    };
    if (options.history === true) {
      file.undo = this.#undoHistory;
      file.redo = this.#redoHistory;
    }
    // Trim data
    for (let l = 0; l < file.data.length; l++) {
      for (let y = file.data[l].length - 1; y >= 0; y--) {
        if (y >= this.height) {
          file.data[l].pop();
          continue;
        }
        for (let x = file.data[l][y].length - 1; x >= 0; x--) {
          if (x >= this.width) {
            file.data[l][y].pop();
          }
        }
      }
    }
    // Output
    return file;
  }

  async setJson(json: File) {
    if (typeof json !== 'object') {
      return ['json must be type object'];
    }
    const errors: string[] = [];
    // Validate 6 properties exist
    const keys = Object.keys(json);
    const required = ['width', 'height', 'transparent', 'colors', 'layers', 'data'];
    required.forEach((key) => {
      if (!keys.includes(key)) {
        errors.push(`JSON key '${key}' required.`);
      }
    });
    // Set props
    this.width = json.width;
    this.height = json.height;
    this.transparent = json.transparent;
    this.#colors = json.colors;
    this.#layers = json.layers;
    this.#data = json.data;
    if (json.undo) {
      this.#undoHistory = json.undo;
    }
    if (json.redo) {
      this.#redoHistory = json.redo;
    }
    this.#init();
  }

  selectColor(index) {
    this.#color = index;
  }

  getColors() {
    return this.#colors;
  }

  addColor(r, g, b, a) {
    this.#colors.push([r, g, b, a]);
  }

  removeColor(index) {
    this.#colors.splice(index, 1);
  }

  getColor(index) {
    return this.#colors[index];
  }

  setColor(index, r, g, b, a) {
    this.#colors[index] = [r, g, b, a];
  }

  moveColor(startIndex, endIndex) {

  }

  getLayers() {
    return this.#data.map((data, index) => index);
  }

  selectLayers(indexes: number[]) {
    this.#layer = indexes;
  }

  addLayer() {
    this.#data.push(fillGrid(this.width, this.height));
    this.#layers.push({
      name: 'Layer 1',
      export: true,
      locked: false,
      visible: true,
      opacity: 1
    });
  }

  /**
   * Remove layer.
   * @param index Layer index to remove
   */
  removeLayer(index) {
    this.#data.splice(index, 1);
  }

  /**
   * Outline.
   */
  outline(include: number[] = []) {
    const pixels = getOutline(this.#data[this.#layer[0]], true, include);
    pixels.forEach(([x, y]) => {
      this.#setPixel(x, y, this.#color);
    });
  }

  /**
   * Glow.
   */
  glow(include: number[] = []) {
    const pixels = getOutline(this.#data[this.#layer[0]], false, include);
    pixels.forEach(([x, y]) => {
      this.#setPixel(x, y, this.#color);
    });
  }

  /**
   * Flatten layers, first index determines the color
   */
  flattenLayers(indexes: number[]) {

  }

  getLayerColorIndexes(layerIndex = this.#layer[0]) {
    return getGridColorIndexes(this.#data[layerIndex]).sort();
  }

  /**
   * Every unique color gets a path
   */
  #getLayerPaths() {
    return this.#data.map((layer, layerIndex) => {
      const colors = this.getLayerColorIndexes(layerIndex);
      return colors.map((color) => {
        return [color, bitmaskToPath(layer, { scale: 1, include: [color] })];
      });
    });
  }

  getLayerPaths() {
    return this.#getLayerPaths() as any;
  }

  getExportPath() {
    return bitmaskToPath(this.#export, { scale: 1 });
  }

  /**
   * Include metadata.
   */
  getExportCanvas(options: Export = {}) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const scale = options.scale ?? 1;
    const offsetX = options.x ?? 0;
    const offsetY = options.y ?? 0;
    canvas.width = (options.width ?? this.width) * scale;
    canvas.height = (options.height ?? this.height) * scale;
    const rows = options.height ?? this.#export.length;
    const columns = options.width ?? this.#export[0].length;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const relativeX = x + offsetX;
        const relativeY = y + offsetY;
        const color = this.#export[relativeY][relativeX];
        const [ r, g, b, a ] = this.#colors[color];
        context.fillStyle = `rgba(${r},${g},${b},${a})`;
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }
    return canvas;
  }

  async #getExportPng(options: Export = {}) {
    return new Promise<Blob>((resolve, reject) => {
      this.getExportCanvas(options).toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject();
        }
      }, 'image/png');
    });
  }

  async getExportPng(options: Export = {}, meta: any = null) {
    const blob = await this.#getExportPng(options);
    if (meta) {
      const arrayBuffer = await blob.arrayBuffer();
      const file = new Uint8Array(arrayBuffer);
      const data = { tEXt: meta };
      const blobWithMeta = writeMetadata(file, data);
      return blobWithMeta.buffer;
    } else {
      return blob;
    }
  }

  async getSelectionPng(options: Export = {}, meta: any = null) {
    const xList: number[] = [];
    const yList: number[] = [];
    this.#selectionPixels.forEach(([x, y]) => {
      xList.push(x);
      yList.push(y);
    });
    let minX = Math.min(...xList),
      minY = Math.min(...yList),
      maxX = Math.max(...xList),
      maxY = Math.max(...yList);
    return await this.getExportPng({
      ...options,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }, meta);
  }

  /**
   * Move selection.
   * @param x X
   * @param y Y
   */
  moveSelection(x: number, y: number) {

  }
}
