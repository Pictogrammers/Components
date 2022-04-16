import { Component, Prop, Part, Local } from '@pictogrammers/element';
// import { createPopper } from '@popperjs/core';
import { debounce, } from '../shared/debounce';
import PgScroll from '../scroll/scroll';

import template from './grid.html';
import style from './grid.css';

declare const ResizeObserver;

const KEY = {
  ArrowUp: 'ArrowUp',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft'
};

interface MouseMeta {
  gridX: number,
  gridY: number,
  x: number,
  y: number,
  width: number,
  height: number,
  column: number,
  row: number,
  index: number,
  gap: number,
  extra: number
}

@Component({
  selector: 'pg-grid',
  style,
  template
})
export default class PgGrid extends HTMLElement {
  @Prop() icons: any = [];
  @Prop() size: number = 24;
  @Prop() padding: number = 8;
  @Prop() gap: number = 4
  @Prop() width: string = 'auto';
  @Prop() height: string = 'auto';

  @Part() $none: HTMLDivElement;
  @Part() $scroll: PgScroll;
  @Part() $grid: HTMLDivElement;

  currentCount = 0;
  currentSize = 0;
  currentPadding = 0;
  currentGap = 0;
  rowHeight = 0;
  items: [HTMLButtonElement, SVGGElement, SVGPathElement][] = [];
  svg = 'http://www.w3.org/2000/svg';
  columns: number;
  debounceRender = debounce(() => this.render({}), 300);
  color = 'svg';

  resizeObserver = new ResizeObserver(() => {
    this.debounceRender();
  });

  connectedCallback() {
    this.resizeObserver.observe(this.$grid);
    this.addEventListener('mousemove', this.handleTooltip.bind(this));
    this.addEventListener('mouseleave', (e: any) => {
      this.index = -2;
      this.handleTooltip(e);
    });

    this.$scroll.addEventListener('calculate', (e: any) => {
      const { offsetY, height, viewWidth, viewHeight } = e.detail;
      this.calculate(offsetY, height, viewWidth, viewHeight);
    });
  }

  /**
   * Simplify all the mouse to usable data.
   *
   * @param e MouseEvent
   */
  getMetaFromMouse(e: MouseEvent) {
    const {
      width,
      height,
      gap,
      extra
    } = this.getIconMetrics();
    var rect = (e.target as any).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log(x, y);
    const column = this.getColumnFromX(x, width, gap, extra);
    const row = this.getRowFromY(y, height, gap, extra);
    const index = column !== -1 && row !== -1 ? column + (row * this.columns) : -1;
    // First Column + [Other Columns + Extra Space] x column
    const gridX = (width + gap) + ((column - 1) * width) + (column * (gap + extra));
    const gridY = (row * height) + ((row + 1) * gap);
    return {
      gridX,
      gridY,
      x: gridX + rect.left,
      y: gridY + rect.top,
      width,
      height,
      column,
      row,
      gap,
      extra,
      index,
      icon: this.icons[index]
    };
  }

  getColumnFromX(x: number, width: number, gap: number, extra: number) {
    x = Math.round(x);
    if (x < gap) {
      return -1;
    }
    if (x <= width + gap) {
      return 0;
    }
    const column = Math.floor((x - width - gap) / (width + gap + extra)) + 1;
    const space = x - (column * (width + gap + extra));
    if (space < (gap + extra)) {
      return -1;
    }
    return column;
  }

  getRowFromY(y: number, height: number, gap: number, extra: number) {
    if (y < gap) {
      return -1;
    }
    if (y <= height + gap) {
      return 0;
    }
    const row = Math.floor((y - height - gap) / (height + gap)) + 1;
    const space = y - (row * (height + gap));
    if (space < gap) {
      return -1;
    }
    return row;
  }

  index = 0;
  hoverLast = 0;
  /**
   * Handle Tooltip
   *
   * this.index
   * -1 = closed
   * -2 = force close
   */
  handleTooltip(e: MouseEvent) {
    const mouseMeta = this.getMetaFromMouse(e);
    const {
      column,
      index
    } = mouseMeta;
    if (this.hoverLast >= 0) {
      this.items[this.hoverLast][0].classList.toggle('hover', false);
    }
    var gridIndex = index - (this.currentRow * this.columns);
    if (gridIndex >= 0) {
      this.items[gridIndex][0].classList.toggle('hover', true);
      this.hoverLast = gridIndex;
    }
    if (this.index !== index) {
      if (index === -1 || this.index === -2) {
        mouseMeta.index = this.index;
        this.hideTooltip(this.icons[this.index], mouseMeta);
        this.index = -1;
      } else {
        if (this.icons[index]) {
          if (column > this.columns - 1) {
            mouseMeta.index = this.index;
            this.hideTooltip(this.icons[this.index], mouseMeta);
            this.index = -1;
          } else {
            this.showTooltip(this.icons[index], mouseMeta);
            this.index = index;
          }
        }
      }
    }
  }

  updateHover() {
    this.items[this.index][0].classList.toggle('hover', false);
  }

  syncVirtual(count) {
    for (let i = this.currentCount; i < count; i++) {
      this.currentCount = i + 1;
      const btn = document.createElement('button');
      btn.dataset.index = `${i}`;
      btn.addEventListener('click', () => {
        const index = i + (this.columns * this.currentRow);
        this.handleClick(this.icons[index]);
      });
      btn.addEventListener('keydown', (e: KeyboardEvent) => {
        const index = i + (this.columns * this.currentRow);
        this.moveFocus(e, index);
      });
      btn.addEventListener('contextmenu', (e: any) => {
        var rect = this.$grid.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        this.showContextMenu(i, x, y);
        e.preventDefault();
      });
      const svg = document.createElementNS(this.svg, 'svg') as SVGGElement;
      svg.setAttribute('viewBox', '0 0 24 24');
      const path = document.createElementNS(this.svg, 'path') as SVGPathElement;
      svg.appendChild(path);
      btn.appendChild(svg);
      this.$grid.appendChild(btn);
      this.items.push([btn, svg, path]);
    }
    for (let i = this.currentCount; i > count; i--) {
      const ele = this.items.pop() as any;
      this.$grid.removeChild(ele[0]);
      this.currentCount--;
    }
    const {
      size,
      padding,
      gap,
      width,
      height,
      rowHeight,
      scrollWidth,
      extra
    } = this.getIconMetrics();
    let x = gap;
    let y = gap;
    // todo reverse the code above to get the columnIndex
    this.items.forEach(([btn, svg], i) => {
      btn.style.padding = `${padding}px`;
      btn.style.width = `${width}px`;
      btn.style.height = `${height}px`;
      btn.style.transform = `translate(${x}px, ${y}px)`;
      svg.style.width = `${size}px`;
      svg.style.height = `${size}px`;
      x += width + gap + extra;
      if (i % this.columns === this.columns - 1) {
        y += height + gap;
        x = gap;
      }
    });
  }

  currentRow = 0;
  timeouts: any[] = [];
  cacheHeight = 0;
  cacheViewWidth = 0;
  calculate(offsetY, height, viewWidth, viewHeight) {
    const rowHeight = this.rowHeight;
    const count = this.icons.length;
    const rows = Math.ceil(viewHeight / rowHeight) + 1;
    const row = Math.floor(offsetY / rowHeight);
    this.$grid.style.transform = `translateY(${-1 * offsetY % rowHeight}px)`;
    if (this.cacheHeight !== height || this.cacheViewWidth !== viewWidth) {
      this.syncVirtual(rows * this.columns);
      this.cacheHeight = height;
      this.cacheViewWidth = viewWidth;
    }
    if (this.currentRow !== row) {
      this.items.forEach(([btn, svg, path], i) => {
        const index = i + (row * this.columns);
        if (index < count) {
          path.setAttribute('d', this.icons[index].data);
          btn.style.display = 'block';
        } else {
          btn.style.display = 'none';
        }
      });
      this.currentRow = row;
    }
  }

  getIconMetrics() {
    const size = parseInt(this.size as any, 10);
    const padding = parseInt(this.padding as any, 10);
    const gap = parseInt(this.gap as any, 10);
    const {
      width: scrollWidth
    } = this.$scroll.getBoundingClientRect();
    const sizePadding = size + (padding * 2);
    const rowHeight = sizePadding + gap;
    const extra = (scrollWidth - gap - (rowHeight * this.columns)) / (this.columns - 1);
    return {
      size,
      padding,
      gap,
      width: sizePadding,
      height: sizePadding,
      rowHeight,
      extra,
      scrollWidth
    };
  }

  calculateColumns(width, rowHeight) {
    const actualWidth = width - this.currentGap;
    const columns = Math.floor(actualWidth / rowHeight);
    return columns > 0 ? columns : 1;
  }

  render(changes) {
    // Calculate Icon Size
    const { size, padding, gap, rowHeight, scrollWidth } = this.getIconMetrics();
    if (this.currentSize !== size || this.currentPadding !== padding || this.currentGap !== gap) {
      this.currentSize = size;
      this.currentPadding = padding;
      this.currentGap = gap;
      this.rowHeight = rowHeight;
    }
    // Calculate Columns
    const columns = this.calculateColumns(scrollWidth, rowHeight);
    if (this.columns !== columns) {
      this.columns = columns;
    }
    // Virtual Grid
    const count = this.icons.length;
    if (count) {
      const rows = Math.ceil(count / this.columns);
      this.currentRow = -1;
      console.log('---', gap + (rows * rowHeight));
      console.log('init', this.$scroll.height)
      this.$scroll.setAttribute('height', (gap + (rows * rowHeight)).toString());
    } else {
      this.$scroll.setAttribute('height', '0')
    }
    this.$none.classList.toggle('show', count === 0);
  }

  moveFocus(e: KeyboardEvent, index: number) {
    let newIndex;
    switch (e.key) {
      case KEY.ArrowLeft:
        newIndex = index - 1;
        if (newIndex >= 0) {
          this.items[newIndex][0].focus();
          e.preventDefault();
        }
        break;
      case KEY.ArrowUp:
        newIndex = index - this.columns;
        if (newIndex >= 0) {
          this.items[newIndex][0].focus();
          e.preventDefault();
        }
        break;
      case KEY.ArrowRight:
        newIndex = index + 1;
        if (newIndex < this.icons.length) {
          this.items[newIndex][0].focus();
          e.preventDefault();
        }
        break;
      case KEY.ArrowDown:
        newIndex = index + this.columns;
        if (newIndex < this.icons.length) {
          this.items[newIndex][0].focus();
          e.preventDefault();
        } else if (newIndex !== this.icons.length - 1) {
          this.items[this.icons.length - 1][0].focus();
          e.preventDefault();
        }
        break;
    }
  }

  handleClick(icon: any) {
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: icon
      })
    );
  }

  canOpenTooltip = true;
  preventClose = false;
  currentIndex = 0;

  showContextMenu(index: number, x: number, y: number) {
    this.dispatchEvent(new CustomEvent('openmenu'));
  }

  hideContextMenu() {
    this.dispatchEvent(new CustomEvent('closemenu'));
    this.canOpenTooltip = true;
  }

  showTooltip(icon: any, mouseMeta: MouseMeta) {
    if (!this.canOpenTooltip) { return; }
    this.dispatchEvent(new CustomEvent('entericon', {
      detail: mouseMeta
    }));
  }

  hideTooltip(icon: any, mouseMeta: MouseMeta) {
    this.dispatchEvent(new CustomEvent('leaveicon', {
      detail: mouseMeta
    }));
  }

  getPositionFromIndex(index: number) {
    return {
      x: index % this.columns,
      y: Math.floor(index / this.columns)
    };
  }
}