import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeResize.html';
import style from './nodeResize.css';
import { drag } from './dragUtil';

@Component({
  selector: 'pg-node-resize',
  style,
  template,
})
export default class PgNodeResize extends HTMLElement {

  @Prop() gridSize: number = 16;
  @Prop() x: number = 0;
  @Prop() y: number = 0;
  @Prop() width: number = 12;
  @Prop() height: number = 3;
  @Prop() minWidth: number = 12;
  @Prop() minHeight: number = 3;

  @Part() $northWest: HTMLDivElement;
  @Part() $north: HTMLDivElement;
  @Part() $northEast: HTMLDivElement;
  @Part() $west: HTMLDivElement;
  @Part() $east: HTMLDivElement;
  @Part() $southWest: HTMLDivElement;
  @Part() $south: HTMLDivElement;
  @Part() $southEast: HTMLDivElement;

  connectedCallback() {
    let startX = 0, startY = 0, startWidth = 0, startHeight = 0;

    const start = () => {
      startX = this.x;
      startY = this.y;
      startWidth = this.width;
      startHeight = this.height;
      this.classList.toggle('preview', true);
    };

    // wDir: -1 = west edge (x + width change), 0 = no width, 1 = east edge (width only)
    // hDir: -1 = north edge (y + height change), 0 = no height, 1 = south edge (height only)
    const addHandle = (source: HTMLElement, wDir: -1 | 0 | 1, hDir: -1 | 0 | 1) => {
      drag({
        source,
        gridSize: this.gridSize,
        start,
        move: (dx, dy) => {
          // Sub-grid residual must mirror dragUtil's asymmetric floor/ceil snap algorithm.
          // For positive deltas: floor; for negative: ceil. This avoids a ~gridSize jump
          // each time snap fires and the anchor moves.
          const sgX = this.#subGrid(dx);
          const sgY = this.#subGrid(dy);
          this.style.setProperty('--node-resize-delta-x',      `${wDir === -1 ? sgX : 0}px`);
          this.style.setProperty('--node-resize-delta-width',  `${wDir !== 0 ? wDir * sgX : 0}px`);
          this.style.setProperty('--node-resize-delta-y',      `${hDir === -1 ? sgY : 0}px`);
          this.style.setProperty('--node-resize-delta-height', `${hDir !== 0 ? hDir * sgY : 0}px`);
          const atMinW = wDir !== 0 && startWidth + wDir * dx < this.minWidth;
          const atMinH = hDir !== 0 && startHeight + hDir * dy < this.minHeight;
          source.classList.toggle('stop', atMinW || atMinH);
        },
        snap: (dx, dy) => {
          this.emit(...this.#compute(startX, startY, startWidth, startHeight, dx, dy, wDir, hDir));
        },
        end: (dx, dy, complete) => {
          if (complete) {
            this.emit(...this.#compute(startX, startY, startWidth, startHeight, dx, dy, wDir, hDir));
          } else {
            this.emit(startX, startY, startWidth, startHeight);
          }
          source.classList.toggle('stop', false);
          this.classList.toggle('preview', false);
          this.style.setProperty('--node-resize-delta-x', '0px');
          this.style.setProperty('--node-resize-delta-y', '0px');
          this.style.setProperty('--node-resize-delta-width', '0px');
          this.style.setProperty('--node-resize-delta-height', '0px');
        },
      });
    };

    addHandle(this.$northWest, -1, -1);
    addHandle(this.$north,      0, -1);
    addHandle(this.$northEast,  1, -1);
    addHandle(this.$west,      -1,  0);
    addHandle(this.$east,       1,  0);
    addHandle(this.$southWest, -1,  1);
    addHandle(this.$south,      0,  1);
    addHandle(this.$southEast,  1,  1);
  }

  render(_changes: any) {}

  // Mirrors dragUtil's snap: floor for positive deltas, ceil for negative.
  // Returns pixel residual past the last snap boundary so CSS preview tracks smoothly.
  #subGrid(delta: number): number {
    const { gridSize } = this;
    const half = gridSize / 2;
    const snapped = delta + half < 0
      ? Math.ceil((delta + half) / gridSize) * gridSize
      : Math.floor((delta + half) / gridSize) * gridSize;
    return delta - snapped;
  }

  #compute(
    startX: number, startY: number,
    startWidth: number, startHeight: number,
    dx: number, dy: number,
    wDir: -1 | 0 | 1, hDir: -1 | 0 | 1
  ): [number, number, number, number] {
    const newWidth  = wDir !== 0 ? Math.max(startWidth  + wDir * dx, this.minWidth)  : startWidth;
    const newHeight = hDir !== 0 ? Math.max(startHeight + hDir * dy, this.minHeight) : startHeight;
    // West/north edges: shift x/y to keep the opposite edge stationary
    const newX = wDir === -1 ? startX + (startWidth  - newWidth)  : startX;
    const newY = hDir === -1 ? startY + (startHeight - newHeight) : startY;
    return [newX, newY, newWidth, newHeight];
  }

  emit(x: number, y: number, width: number, height: number) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { x, y, width, height },
    }));
  }
}
