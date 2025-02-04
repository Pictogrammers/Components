import { Component, Prop, Part, normalizeInt } from '@pictogrammers/element';

import template from './inputPixelEditor.html';
import style from './inputPixelEditor.css';
import { InputMode } from './utils/inputMode';
import cloneGrid from './utils/cloneGrid';
import getEllipseOutlinePixels from './utils/getEllipseOutlinePixels';
import { WHITE } from './utils/constants';
import getLinePixels from './utils/getLinePixels';
import getRectanglePixels from './utils/getRectangleOutlinePixels';
import getRectangleOutlinePixels from './utils/getRectangleOutlinePixels';
import fillGrid from './utils/fillGrid';
import iterateGrid from './utils/interateGrid';
import bitmaskToPath from './utils/bitmapToMask';
import createLayer from './utils/createLayer';

type Pixel = { x: number, y: number };

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
  @Prop() value: string = '';
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
  #data: number[][] = [];
  #undoHistory: [number, number, number][][] = [];
  #redoHistory: [number, number, number][][] = [];
  #context: CanvasRenderingContext2D;
  #colors: string[] = ['transparent', '#000'];
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
      'contextMenu',
      this.handleContextMenu.bind(this)
    );
    this.$canvas.addEventListener(
      'doubleClick',
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
    if (changes.width || changes.height || changes.size) {
      this.#init();
    }
  }

  #init() {
    const totalSize = this.size + this.gridSize;
    const actualWidth = this.width * totalSize - this.gridSize;
    const actualHeight = this.height * totalSize - this.gridSize;
    this.$canvas.width = actualWidth;
    this.$canvas.height = actualHeight;
    this.#data = fillGrid(this.width, this.height);
    [this.#baseLayer, this.#baseLayerContext] = createLayer(actualWidth, actualHeight);
    [this.#editLayer, this.#editLayerContext] = createLayer(actualWidth, actualHeight);
    [this.#noEditLayer, this.#noEditLayerContext] = createLayer(actualWidth, actualHeight);
    [this.#previewLayer, this.#previewLayerContext] = createLayer(actualWidth, actualHeight);
  }

  #handleChange() {
    const path = bitmaskToPath(this.#data, { scale: 1 });
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

  #setPixel (x: number, y: number, color: number) {
    if (x > this.width) {
      throw new Error(`Invalid x; ${x} > ${this.width}`);
    }
    if (y > this.height) {
      throw new Error(`Invalid y; ${y} > ${this.height}`);
    }
    const totalSize = this.size + this.gridSize;
    // Edit Layer
    this.#editLayerContext.fillStyle = WHITE;
    this.#editLayerContext.fillRect(
      x * totalSize - (this.gridSize) + 1,
      y * totalSize - (this.gridSize) + 1,
      this.size + (this.gridSize * 2) - 2,
      this.size + (this.gridSize * 2) - 2
    );
    this.#editLayerContext.fillStyle = this.#colors[color] === 'transparent' ? WHITE : this.#colors[color];
    this.#editLayerContext.fillRect(x * totalSize + 1, y * totalSize + 1, this.size - 2, this.size - 2);
    // No Edit Layer
    this.#noEditLayerContext.fillStyle = this.#colors[color] === 'transparent' ? WHITE : this.#colors[color];
    this.#noEditLayerContext.fillRect(x * totalSize, y * totalSize, this.size, this.size);
    // Update pixel grid
    /*if (!props.disableTransparency && colors[color] === 'transparent') {
      pixelContext.fillStyle = '#DDD';
      pixelContext.fillRect(x * totalSize + 1, y * totalSize + 1, size, size);
      pixelContext.fillStyle = WHITE;
      pixelContext.fillRect(x * totalSize + 1, y * totalSize + 1, 5, 5);
      pixelContext.fillRect(x * totalSize + 6, y * totalSize + 6, 5, 5);
    } else {*/
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
    console.log('draw pixel(x, y, color, data):', x, y, color, this.#data[y][x]);
    // Verify this is the only place setting pixel data!
    this.#data[y][x] = color;
    this.#delayedChange();
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
    // base layer to main canvas
    this.#context.drawImage(
      this.#baseLayer,
      minX * totalSize, minY * totalSize, maxX * totalSize, maxY * totalSize,
      minX * totalSize, minY * totalSize, maxX * totalSize, maxY * totalSize
    );
    // edit to main canvas
    this.#context.drawImage(
      this.#editLayer,
      minX * totalSize, minY * totalSize, maxX * totalSize, maxY * totalSize,
      minX * totalSize, minY * totalSize, maxX * totalSize, maxY * totalSize
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
      minX * totalSize, minY * totalSize, maxX * totalSize, maxY * totalSize,
      minX * totalSize, minY * totalSize, maxX * totalSize, maxY * totalSize
    );
    this.dispatchEvent(new CustomEvent('debug', {
      detail: {
        editLayer: this.#editLayer,
        baseLayer: this.#baseLayer,
        previewLayer: this.#previewLayer
      }
    }));
    console.log('render preview', minX, minY, maxX, maxY);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      console.log('space!')
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
    const rect = this.$canvas.getBoundingClientRect();
    const totalSize = this.size + this.gridSize;
    let newX = Math.floor((event.clientX - rect.left) / totalSize);
    let newY = Math.floor((event.clientY - rect.top) / totalSize);
    if (newX === this.#x && newY === this.#y) { return; }
    if (newX >= this.width) { newX = this.width - 1; }
    if (newY >= this.height) { newY = this.height - 1; }
    this.#isPressed = true;
    this.#startColor = this.#data[newY][newX];
    this.#startX = newX;
    this.#startY = newY;
    this.#x = newX;
    this.#y = newY;
    const color = event.buttons === 32 ? 0 : 1;
    switch (this.#inputMode) {
      case InputMode.Pixel:
        this.#setPixel(newX, newY, color);
        this.#data[newY][newX] = color;
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
          this.#data[newY][newX] = 0;
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
            data[point[1]][point[0]] = color;
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
    console.log('enter');
  }

  handlePointerLeave(event: MouseEvent) {
    if (!this.#isPressed) {
      this.#isEditing = false;
      // base layer to main canvas
      this.#context.drawImage(this.#baseLayer, 0, 0);
      // editing layer to main canvas
      this.#context.drawImage(this.#isEditing ? this.#editLayer : this.#noEditLayer, 0, 0);
    }
    console.log('leave');
  }

  #updateGrid() {
    // base layer to main canvas
    this.#context.drawImage(this.#baseLayer, 0, 0);
    // editing layer to main canvas
    this.#context.drawImage(this.#editLayer, 0, 0);
  }

  mergeColor(fromIndex: number, toIndex: number) {
    // ToDo: Code this
  }
  clear() {
    this.#data = fillGrid(this.width, this.height);
  }
  clearHistory() {
    this.#undoHistory = [];
    this.#redoHistory = [];
  }
  applyTemplate(template: number[][]) {
    this.#data = template;
  }
  flipHorizontal() {
    const cloned = cloneGrid(this.#data);
    const w = cloned[0].length - 1;
    iterateGrid(this.#data, (x, y) => {
      cloned[y][x] = this.#data[y][w - x];
    });
    this.#data = cloned;
  }
  flipVertical() {
    const cloned = cloneGrid(this.#data);
    const h = cloned.length - 1;
    iterateGrid(this.#data, (x, y) => {
      cloned[y][x] = this.#data[h - y][x];
    });
    this.#data = cloned;
  }
  move(translateX: number, translateY: number) {
    const cloned = fillGrid(this.width, this.height);
    for (let iy = 0; iy < this.height; iy++) {
      cloned[iy].fill(0);
    }
    iterateGrid(this.#data, (x, y) => {
      if (y - translateY < 0
        || x - translateX < 0
        || y - translateY >= this.height
        || x - translateX >= this.width) {
        return;
      }
      cloned[y][x] = this.#data[y - translateY][x - translateX];
    });
    this.#data = cloned;
  }
  invert() {
    // Only works with 2 colors
    if (this.#colors.length > 2) {
      return;
    }
    const cloned = cloneGrid(this.#data);
    iterateGrid(cloned, (x, y) => {
      cloned[y][x] = cloned[y][x] === 0 ? 1 : 0;
    });
    this.#data = cloned;
  }
  undo() {
    // ToDo: Rewrite to use new history api
    const revert = this.#undoHistory.pop();
    if (!revert) { return; }
    this.#redoHistory.push(revert);
    revert?.forEach((item) => {
      const [x, y] = item;
      this.#data[y][x] = item[2];
      // redraw canvas
    });
  }
  redo() {
    // ToDo: Rewrite to use new history api
    const revert = this.#redoHistory.pop();
    if (!revert) { return; }
    this.#undoHistory.push(revert);
    revert?.forEach((item) => {
      const [x, y] = item;
      this.#data[y][x] = item[2];
      // redraw canvas
    });
  }
  rotate(counterClockwise: boolean = false) {
    const cloned = cloneGrid(this.#data);
    if (counterClockwise) {
      const newData = this.#data[0].map((val, index) => this.#data.map(row => row[row.length - 1 - index]));
      for (let iy = 0; iy < this.height; iy++) {
        for (let ix = 0; ix < this.width; ix++) {
          cloned[iy][ix] = newData[iy][ix];
        }
      }
    } else {
      const newData = this.#data[0].map((val, index) => this.#data.map(row => row[index]).reverse());
      for (let iy = 0; iy < this.height; iy++) {
        for (let ix = 0; ix < this.width; ix++) {
          cloned[iy][ix] = newData[iy][ix];
        }
      }
    }
    this.#data = cloned;
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
}
