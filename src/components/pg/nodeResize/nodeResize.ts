import { Component, Prop, Part, forEach } from '@pictogrammers/element';

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
    let startX = 0,
      startY = 0,
      startWidth = 12,
      startHeight = 3;
    const start = () => {
      startX = this.x;
      startY = this.y;
      startWidth = this.width;
      startHeight = this.height;
      this.classList.toggle('preview', true);
    };
    drag({
      source: this.$northWest,
      gridSize: this.gridSize,
      start,
      move: (dx, dy) => {
        this.previewX(dx);
        this.previewY(dy);
        this.previewWidth(dx * -1);
        this.previewHeight(dy * -1);
      },
      snap: (dx, dy) => {
        this.emit(
          startX + dx,
          startY + dy,
          startWidth + dx * -1,
          startHeight + dy * -1
        );
      },
      end: (dx, dy, complete) => {
        if (complete) {
          this.emit(
            startX + dx,
            startY + dy,
            startWidth + dx * -1,
            startHeight + dy * -1
          );
        } else {
          this.emit(startX, startY, startWidth, startHeight);
        }
        this.classList.toggle('preview', false);
      },
    });
    drag({
      source: this.$south,
      gridSize: this.gridSize,
      start,
      move: (dx, dy) => {
        console.log('dy', dy);
        if (startHeight === this.minHeight) {
          this.$south.classList.toggle('stop', dy < 0);
        }
        this.previewHeight(dy);
      },
      snap: (dx, dy) => {
        if (startHeight + dy > this.minHeight) {
          this.emit(startX, startY, startWidth, startHeight + dy);
        } else {
          this.emit(startX, startY, startWidth, this.minHeight);

        }
      },
      end: (dx, dy, complete) => {
        if (complete) {
          this.emit(
            startX,
            startY,
            startWidth,
            startHeight + dy
          );
        } else {
          this.emit(startX, startY, startWidth, startHeight);
        }
        this.$south.classList.toggle('stop', false);
        this.classList.toggle('preview', false);
        this.previewHeight(0);
      },
    });
  }

  render(changes: any) {

  }

  /**
   * Emits delta size changes or 0 for no change.
   * @param x Delta
   * @param y Delta
   * @param width Delta
   * @param height Delta
   */
  emit(x: number, y: number, width: number, height: number) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        x,
        y,
        width,
        height,
      }
    }));
  }

  previewX(x: number) {
    this.style.setProperty('--node-resize-delta-x', `${x % this.gridSize}px`);
  }

  previewY(y: number) {
    this.style.setProperty('--node-resize-delta-y', `${y % this.gridSize}px`);
  }

  previewWidth(width: number) {
    this.style.setProperty('--node-resize-delta-width', `${width % this.gridSize}px`);
  }

  previewHeight(height: number) {
    this.style.setProperty('--node-resize-delta-height', `${((height + (this.gridSize / 2)) % this.gridSize) - (this.gridSize / 2)}px`);
  }
}
