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

  @Part() $header: HTMLDivElement;
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

    // wDir: -1 = west edge moves (x + width change), 0 = no width, 1 = east edge (width only)
    // hDir: -1 = north edge moves (y + height change), 0 = no height, 1 = south edge (height only)
    const addHandle = (source: HTMLElement, wDir: -1 | 0 | 1, hDir: -1 | 0 | 1) => {
      drag({
        source,
        gridSize: this.gridSize,
        start,
        move: (dx, dy) => {
          const gs = this.gridSize;

          // Snap units — must mirror dragUtil's snapUnits exactly
          const snapDx = Math.floor((dx + gs / 2) / gs);
          const snapDy = Math.floor((dy + gs / 2) / gs);

          // Snapped dimension in grid units, clamped to min (what the anchor currently reflects)
          const snappedW = wDir !== 0 ? Math.max(startWidth  + wDir * snapDx, this.minWidth)  : startWidth;
          const snappedH = hDir !== 0 ? Math.max(startHeight + hDir * snapDy, this.minHeight) : startHeight;

          // Pixel-accurate cursor tracking, clamped so the preview never goes below min.
          // When clamped, effectivePx === snappedPx and the delta becomes 0 (overlay freezes).
          const effectiveWPx = wDir !== 0 ? Math.max(startWidth  * gs + wDir * dx, this.minWidth  * gs) : startWidth  * gs;
          const effectiveHPx = hDir !== 0 ? Math.max(startHeight * gs + hDir * dy, this.minHeight * gs) : startHeight * gs;

          // Sub-pixel delta from the snapped anchor position
          const dw = effectiveWPx - snappedW * gs;
          const dh = effectiveHPx - snappedH * gs;

          // For west/north handles the opposite edge is fixed, so x/y shift opposite to size.
          this.style.setProperty('--node-resize-delta-x',      `${wDir === -1 ? -dw : 0}px`);
          this.style.setProperty('--node-resize-delta-width',  `${dw}px`);
          this.style.setProperty('--node-resize-delta-y',      `${hDir === -1 ? -dh : 0}px`);
          this.style.setProperty('--node-resize-delta-height', `${dh}px`);

          const atMinW = wDir !== 0 && startWidth  * gs + wDir * dx < this.minWidth  * gs;
          const atMinH = hDir !== 0 && startHeight * gs + hDir * dy < this.minHeight * gs;
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

    // Header: translate the whole node — no resize, both x and y move together
    drag({
      source: this.$header,
      gridSize: this.gridSize,
      start,
      move: (dx, dy) => {
        const gs = this.gridSize;
        const snapDx = Math.floor((dx + gs / 2) / gs);
        const snapDy = Math.floor((dy + gs / 2) / gs);
        this.style.setProperty('--node-resize-delta-x',      `${dx - snapDx * gs}px`);
        this.style.setProperty('--node-resize-delta-y',      `${dy - snapDy * gs}px`);
        this.style.setProperty('--node-resize-delta-width',  '0px');
        this.style.setProperty('--node-resize-delta-height', '0px');
      },
      snap: (dx, dy) => {
        this.emit(startX + dx, startY + dy, startWidth, startHeight);
      },
      end: (dx, dy, complete) => {
        if (complete) {
          this.emit(startX + dx, startY + dy, startWidth, startHeight);
        } else {
          this.emit(startX, startY, startWidth, startHeight);
        }
        this.classList.toggle('preview', false);
        this.style.setProperty('--node-resize-delta-x',      '0px');
        this.style.setProperty('--node-resize-delta-y',      '0px');
        this.style.setProperty('--node-resize-delta-width',  '0px');
        this.style.setProperty('--node-resize-delta-height', '0px');
      },
    });
  }

  render(_changes: any) {}

  #compute(
    startX: number, startY: number,
    startWidth: number, startHeight: number,
    dx: number, dy: number,
    wDir: -1 | 0 | 1, hDir: -1 | 0 | 1
  ): [number, number, number, number] {
    const newWidth  = wDir !== 0 ? Math.max(startWidth  + wDir * dx, this.minWidth)  : startWidth;
    const newHeight = hDir !== 0 ? Math.max(startHeight + hDir * dy, this.minHeight) : startHeight;
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
