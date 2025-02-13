import { Component, Prop, Part, normalizeInt, normalizeBoolean } from '@pictogrammers/element';

import template from './inputPixelEditor.html';
import style from './inputPixelEditor.css';
import { InputMode } from './utils/inputMode';
import cloneGrid from './utils/cloneGrid';
import getEllipseOutlinePixels from './utils/getEllipseOutlinePixels';
import { WHITE } from './utils/constants';
import getLinePixels from './utils/getLinePixels';
import getRectanglePixels from './utils/getRectanglePixels';
import getRectangleOutlinePixels from './utils/getRectangleOutlinePixels';
import fillGrid from './utils/fillGrid';
import iterateGrid from './utils/interateGrid';
import bitmaskToPath from './utils/bitmapToMask';
import createLayer from './utils/createLayer';
import diffGrid from './utils/diffGrid';
import { getGuides } from './utils/getGuides';

type Pixel = { x: number, y: number };

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

type History = {
  type: HistoryType,
  data: HistoryGroupType | HistoryPixelType | HistoryColorUpdateType
}

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

  @Part() $canvas: HTMLCanvasElement;

  // Internal State
  #inputMode: InputMode = InputMode.Pixel;
  #isPressed: boolean = false;
  #isEditing: boolean = false;
  #startColor: number = -1;
  #startX: number = -1;
  #startY: number = -1;
  #x: number = -1;
  #y: number = -1;
  #layer: number = 0;
  #layers: Layer[] = [];
  #isCtrl: boolean = false;
  #isShift: boolean = false;
  #isAlt: boolean = false;
  #data: number[][][] = [];
  #undoHistory: History[] = [];
  #redoHistory: History[] = [];
  #context: CanvasRenderingContext2D;
  #colors: Color[] = [
    [0, 0, 0, 0],
    [0, 0, 0, 1]
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
      'pointerup',
      this.handlePointerUp.bind(this)
    );
    this.$canvas.addEventListener(
      'pointermove',
      this.handlePointerMove.bind(this)
    );
    this.$canvas.addEventListener(
      'pointerenter',
      this.handlePointerEnter.bind(this)
    );
    this.$canvas.addEventListener(
      'pointerleave',
      this.handlePointerLeave.bind(this)
    );
    this.$canvas.addEventListener(
      'keydown',
      this.handleKeyDown.bind(this)
    );
    this.$canvas.addEventListener(
      'keyup',
      this.handleKeyUp.bind(this)
    );
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
    if (this.#reset) {
      this.#layer = 0;
      this.#layers = [{
        name: 'Layer 1',
        export: true,
        locked: false,
        visible: true,
        opacity: 1
      }];
      this.#data = [fillGrid(this.width, this.height)];
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
        }
      }
      for (let x = 0; x < this.width; x++) {
        if (x >= data[0][y].length) {
          for (let l = 0; l < layerCount; l++) {
            data[l][y].push(0);
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
    const path = bitmaskToPath(this.#data[this.#layer], { scale: 1 });
    console.log('change:', path);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: path }
    }));
    /*this.dispatchEvent(new CustomEvent('change', {
      detail: data
    }));*/
  };

  #delayTimerId: number = 0;
  #delayedChange() {
    clearInterval(this.#delayTimerId);
    this.#delayTimerId = window.setTimeout(this.#handleChange.bind(this), 1000);
  };

  #setPixel(x: number, y: number, color: number) {
    if (x > this.width) {
      throw new Error(`Invalid x; ${x} > ${this.width}`);
    }
    if (y > this.height) {
      throw new Error(`Invalid y; ${y} > ${this.height}`);
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
    console.log('draw pixel(x, y, color, data):', x, y, color, this.#data[this.#layer][y][x]);
    // Verify this is the only place setting pixel data!
    this.#data[this.#layer][y][x] = color;
    this.#delayedChange();
  }

  #setPixelAll() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.#setPixel(x, y, this.#data[this.#layer][y][x]);
      }
    }
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

  handleKeyDown(event: KeyboardEvent) {
    console.log(event.shiftKey, event.ctrlKey, event.altKey, event.key);
    switch (event.key) {
      case ' ':
        console.log('space');
        break;
      case 'Escape':
        console.log('escape');
        // Cancel editing
        break;
    }
  }

  handleKeyUp(event: KeyboardEvent) {

  }

  handleContextMenu(event: MouseEvent) {
    event?.preventDefault();
  }

  handleDoubleClick(event: MouseEvent) {
    event?.preventDefault();
  }

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
    this.#startColor = this.#data[this.#layer][newY][newX];
    this.#startX = newX;
    this.#startY = newY;
    this.#x = newX;
    this.#y = newY;
    const color = event.buttons === 32 ? 0 : 1;
    switch (this.#inputMode) {
      case InputMode.Pixel:
        this.#setPixel(newX, newY, color);
        this.#data[this.#layer][newY][newX] = color;
        break;
    }
    console.log(this.#inputMode, newX, newY);
  }

  handlePointerUp(event: MouseEvent) {
    const rect = this.$canvas.getBoundingClientRect();
    const totalSize = this.size + this.gridSize;
    let newX = Math.floor((event.clientX - rect.left) / totalSize);
    let newY = Math.floor((event.clientY - rect.top) / totalSize);
    if (newX >= this.width) { newX = this.width - 1; }
    if (newY >= this.height) { newY = this.height - 1; }
    if (this.#startX === -1 && this.#startY === -1) {
      return;
    }
    // Single Tap
    if (newX === this.#startX && newY === this.#startY && this.#startColor === 1) {
      switch (this.#inputMode) {
        case InputMode.Pixel:
          this.#setPixel(newX, newY, 0);
          this.#data[this.#layer][newY][newX] = 0;
          break;
      }
    } else {
      switch (this.#inputMode) {
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
          getEllipseOutlinePixels(this.#startX, this.#startY, newX, newY).forEach(({ x, y }) => {
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
          if (tX >= this.width || tY >= this.height || (tX === x && tY === y)) {
            continue;
          }
          points.push([tX, tY]);
        }
      } else {
        let newX = Math.floor((event.clientX - rect.left) / totalSize);
        let newY = Math.floor((event.clientY - rect.top) / totalSize);
        if (newX === x && newY === y) { return; }
        if (newX >= this.width) { newX = this.width - 1; }
        if (newY >= this.height) { newY = this.height - 1; }
        points.push([newX, newY]);
      }
      // Is Eraser
      const color = event.buttons === 32 ? 0 : 1;
      // Shape tools only care about the last point
      if (points.length === 0) { return; }
      const [lastX, lastY] = points.at(-1) as [number, number];
      // This is not ideal, but might be good enough,
      // really it should be finding the point furthest absolute
      // point from startX/startY.
      this.#x = lastX;
      this.#y = lastY;
      switch (this.#inputMode) {
        case InputMode.Pixel:
          for (var point of points) {
            this.#setPixel(point[0], point[1], color);
            data[this.#layer][point[1]][point[0]] = color;
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
          this.#setPreview(getEllipseOutlinePixels(startX, startY, lastX, lastY), x, y);
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
    }
  }

  handlePointerLeave(event: MouseEvent) {
    if (!this.#isPressed) {
      this.#isEditing = false;
      // base layer to main canvas
      this.#context.drawImage(this.#baseLayer, 0, 0);
      // editing layer to main canvas
      this.#context.drawImage(this.#isEditing ? this.#editLayer : this.#noEditLayer, 0, 0);
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

  clear() {
    const gridEmpty = fillGrid(this.width, this.height);
    const diff = diffGrid(this.#data[this.#layer], gridEmpty);
    this.#undoHistory.push({
      type: HistoryType.Group,
      data: {
        name: 'Clear'
      }
    });
    this.#undoHistory.push({
      type: HistoryType.Pixel,
      data: {
        pixels: [],
        layer: this.#layer
      }
    });
    this.#data = [fillGrid(this.width, this.height)];
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

  applyTemplate(template: number[][]) {
    this.#data = [template];
    this.#setPixelAll();
  }

  flipHorizontal() {
    const cloned = cloneGrid(this.#data[this.#layer]);
    const w = cloned[0].length - 1;
    iterateGrid(this.#data[this.#layer], (x, y) => {
      cloned[y][x] = this.#data[this.#layer][y][w - x];
    });
    this.#data[this.#layer] = cloned;
  }

  flipVertical() {
    const cloned = cloneGrid(this.#data[this.#layer]);
    const h = cloned.length - 1;
    iterateGrid(this.#data[this.#layer], (x, y) => {
      cloned[this.#layer][y][x] = this.#data[h - y][x];
    });
    this.#data[this.#layer] = cloned;
  }

  move(translateX: number, translateY: number) {
    const cloned = fillGrid(this.width, this.height);
    for (let iy = 0; iy < this.height; iy++) {
      cloned[iy].fill(0);
    }
    iterateGrid(this.#data[this.#layer], (x, y) => {
      if (y - translateY < 0
        || x - translateX < 0
        || y - translateY >= this.height
        || x - translateX >= this.width) {
        return;
      }
      cloned[y][x] = this.#data[this.#layer][y - translateY][x - translateX];
    });
    this.#data[this.#layer] = cloned;
  }

  invert() {
    // Only works with 2 colors
    if (this.#colors.length > 2) {
      return;
    }
    iterateGrid(this.#data[this.#layer], (x, y) => {
      this.#data[this.#layer][y][x] = this.#data[this.#layer][y][x] === 0 ? 1 : 0;
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
    const revert = this.#undoHistory.pop();
    if (!revert) { return; }
    switch (revert.type) {
      case HistoryType.Pixel:
        this.#redoHistory.push(revert);
        (revert.data as HistoryPixelType).pixels.forEach((item) => {
          const [x, y] = item;
          this.#data[this.#layer][y][x] = item[2];
          // redraw canvas
        });
        break;
    }
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
    const cloned = cloneGrid(this.#data[this.#layer]);
    if (counterClockwise) {
      const newData = this.#data[0].map((val, index) => this.#data.map(row => row[row.length - 1 - index]));
      for (let iy = 0; iy < this.height; iy++) {
        for (let ix = 0; ix < this.width; ix++) {
          cloned[iy][ix] = newData[this.#layer][iy][ix];
        }
      }
    } else {
      const newData = this.#data[0].map((val, index) => this.#data.map(row => row[index]).reverse());
      for (let iy = 0; iy < this.height; iy++) {
        for (let ix = 0; ix < this.width; ix++) {
          cloned[iy][ix] = newData[this.#layer][iy][ix];
        }
      }
    }
    this.#data[this.#layer] = cloned;
  }

  hasUndo() {
    return this.#undoHistory.length !== 0;
  }

  hasRedo() {
    return this.#redoHistory.length !== 0;
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

  async save(options: FileOptions = {}): Promise<File> {
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

  async open(json: File) {
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

}
