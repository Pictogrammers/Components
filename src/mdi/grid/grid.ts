import { Component, Prop, Part, Local } from '@mdi/element';
import { createPopper } from '@popperjs/core';
import { addInfoToast } from '../shared/toast';
import { debounce, copyText } from './utils';
import { getCopySvgInline } from './copy';

import template from './grid.html';
import style from './grid.css';

declare const ResizeObserver;

@Component({
  selector: 'mdi-grid',
  style,
  template
})
export default class MdiGrid extends HTMLElement {
  @Prop() icons: any = [];
  @Prop() size: number = 24;
  @Prop() width: string = 'auto';
  @Prop() height: string = 'auto';

  @Part() $grid: HTMLDivElement;

  @Part() $contextMenu: HTMLDivElement;
  @Part() $newTab: HTMLAnchorElement;
  @Part() $copyIconName: HTMLButtonElement;
  @Part() $pngBlack: HTMLButtonElement;
  @Part() $pngWhite: HTMLButtonElement;
  @Part() $pngColor: HTMLButtonElement;
  @Part() $png24: HTMLButtonElement;
  @Part() $png36: HTMLButtonElement;
  @Part() $png48: HTMLButtonElement;
  @Part() $png96: HTMLButtonElement;
  @Part() $pngDownload: HTMLButtonElement;
  @Part() $svgBlack: HTMLButtonElement;
  @Part() $svgWhite: HTMLButtonElement;
  @Part() $svgColor: HTMLButtonElement;
  @Part() $svgDownload: HTMLButtonElement;
  @Part() $copySvgInline: HTMLButtonElement;
  @Part() $copySvgFile: HTMLButtonElement;
  @Part() $copySvgPath: HTMLButtonElement;
  @Part() $copyUnicode: HTMLButtonElement;
  @Part() $copyCodepoint: HTMLButtonElement;
  @Part() $copyPreview: HTMLButtonElement;

  @Part() $tooltip: HTMLDivElement;
  @Part() $tooltipText: HTMLSpanElement;
  @Part() $tooltipArrow: HTMLDivElement;
  @Part() $color: any;
  @Part() $colorPicker: any;
  @Part() $colorHexRgb: any;

  @Local('#000000') cachePngColor: string;
  @Local('24') cachePngSize: string;
  @Local('#000000') cacheSvgColor: string;

  currentCount = 0;
  items: [HTMLButtonElement, SVGPathElement][] = [];
  svg = 'http://www.w3.org/2000/svg';
  columns: number;
  debounceRender = debounce(() => this.render(), 300);
  color = 'svg';

  resizeObserver = new ResizeObserver(entries => {
    const { width } = entries[0].contentRect;
    const columns = Math.floor(width / (this.size + 20));
    if (this.columns !== columns) {
      this.columns = columns;
      this.debounceRender();
    }
  });

  connectedCallback() {
    this.resizeObserver.observe(this.$grid);
    this.addEventListener('mousemove', this.handleTooltip.bind(this));
    this.addEventListener('mouseleave', this.hideTooltip.bind(this));
    // Wire Up Context Menu
    this.$copyIconName.addEventListener('click', this.handleCopyIconName.bind(this));
    this.$svgBlack.addEventListener('click', () => {
      this.cacheSvgColor = '#000000';
      this.render();
    });
    this.$svgWhite.addEventListener('click', () => {
      this.cacheSvgColor = '#FFFFFF';
      this.render();
    });
    let preventSvgColor = false;
    this.$svgColor.addEventListener('click', () => {
      if (preventSvgColor) { preventSvgColor = false; return; }
      this.color = 'svg';
      this.$colorPicker.value = this.cacheSvgColor;
      this.$colorHexRgb.value = this.cacheSvgColor;
      const self = this;
      createPopper(this.$svgColor, this.$color, {
        placement: 'bottom-start'
      });
      this.$color.style.visibility = 'visible';
      let outside = true;
      function handleMouseDown(e) {
        if (outside) {
          self.$color.style.visibility = 'hidden';
          document.removeEventListener('mousedown', handleMouseDown);
          preventSvgColor = true;
          self.render();
          setTimeout(() => preventSvgColor = false, 500);
        }
      }
      this.$color.addEventListener('mouseenter', () => outside = false);
      this.$color.addEventListener('mouseleave', () => outside = true);
      document.addEventListener('mousedown', handleMouseDown);
    });
    this.$pngBlack.addEventListener('click', () => {
      this.cachePngColor = '#000000';
      this.render();
    });
    this.$pngWhite.addEventListener('click', () => {
      this.cachePngColor = '#FFFFFF';
      this.render();
    });
    let preventPngColor = false;
    this.$pngColor.addEventListener('click', () => {
      if (preventPngColor) { preventPngColor = false; return; }
      this.color = 'png';
      this.$colorPicker.value = this.cachePngColor;
      this.$colorHexRgb.value = this.cachePngColor;
      const self = this;
      createPopper(this.$pngColor, this.$color, {
        placement: 'bottom-start'
      });
      this.$color.style.visibility = 'visible';
      let outside = true;
      function handleMouseDown(e) {
        if (outside) {
          self.$color.style.visibility = 'hidden';
          document.removeEventListener('mousedown', handleMouseDown);
          preventPngColor = true;
          self.render();
          setTimeout(() => preventPngColor = false, 500);
        }
      }
      this.$color.addEventListener('mouseenter', () => outside = false);
      this.$color.addEventListener('mouseleave', () => outside = true);
      document.addEventListener('mousedown', handleMouseDown);
    });
    this.$png24.addEventListener('click', () => {
      this.cachePngSize = '24';
      this.render();
    });
    this.$png36.addEventListener('click', () => {
      this.cachePngSize = '36';
      this.render();
    });
    this.$png48.addEventListener('click', () => {
      this.cachePngSize = '48';
      this.render();
    });
    this.$png96.addEventListener('click', () => {
      this.cachePngSize = '96';
      this.render();
    });
    this.$svgDownload.addEventListener('click', () => {
      alert(`SVG ${this.cacheSvgColor}`);
    });
    this.$pngDownload.addEventListener('click', () => {
      alert(`SVG ${this.cachePngSize} ${this.cachePngColor}`);
    });
    this.$copySvgInline.addEventListener('click', () => {
      const icon = this.icons[this.currentIndex];
      copyText(getCopySvgInline(icon));
      this.hideContextMenu();
      addInfoToast(`Copied inline SVG "${icon.name}" to clipboard.`);
    });
    this.$copySvgFile.addEventListener('click', () => {

    });
    this.$copySvgPath.addEventListener('click', () => {

    });
    this.$copyUnicode.addEventListener('click', () => {

    });
    this.$copyCodepoint.addEventListener('click', () => {

    });
    this.$copyPreview.addEventListener('click', () => {

    });
  }

  index = 0;
  handleTooltip(e: any) {
    var rect = e.target.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    const tileX = Math.floor(x / 44);
    const tileY = Math.floor(y / 44);
    const index = tileX + (tileY * this.columns);
    if (this.index !== index) {
      if (this.icons[index]) {
        if (tileX > this.columns - 1) {
          this.hideTooltip();
        } else {
          this.showTooltip(this.icons[index], index);
        }
        this.index = index;
      } else {
        this.hideTooltip();
      }
    }
  }

  render() {
    const count = this.icons.length;
    // Grid
    for(let i = this.currentCount; i < count; i++) {
      this.currentCount = i + 1;
      const btn = document.createElement('button');
      btn.dataset.index = `${i}`;
      btn.addEventListener('click', () => {
        this.handleClick(this.icons[i]);
      });
      btn.addEventListener('keydown', (e: KeyboardEvent) => {
        this.moveFocus(e, i);
      });
      btn.addEventListener('contextmenu', (e: any) => {
        var rect = this.$grid.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        this.showContextMenu(i, x, y);
        e.preventDefault();
      });
      const svg = document.createElementNS(this.svg, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      const path = document.createElementNS(this.svg, 'path') as SVGPathElement;
      svg.appendChild(path);
      btn.appendChild(svg);
      this.$grid.appendChild(btn);
      this.items.push([btn, path]);
    }
    if (count < this.currentCount) {
      this.items.forEach(([btn]) => {
        btn.style.display = 'none';
      });
    }
    this.items.slice(0, count).forEach(([btn]) => {
      btn.style.display = 'block';
    });
    const rows = Math.ceil(count / this.columns);
    this.$grid.style.gridTemplateRows = `repeat(${rows}, 2.75rem)`;
    this.items.forEach(([btn, path], i) => {
      if (this.icons[i]) {
        btn.style.gridColumn = `${(i % this.columns + 1)}`;
        btn.style.gridRow = `${Math.ceil((i + 1) / this.columns)}`;
        path.setAttribute('d', this.icons[i].data);
        this.icons[i].id = i;
      } else {
        path.setAttribute('d', '');
      }
    });
    if (this.height === 'auto') {
      this.$grid.style.height = `${2.75 * rows}rem`;
      this.$grid.style.overflow = 'visible';
    } else {
      this.$grid.style.height = this.height;
      this.$grid.style.overflow = 'auto';
    }
    // Context Menu
    this.$svgBlack.classList.toggle('active', this.cacheSvgColor === '#000000');
    this.$svgWhite.classList.toggle('active', this.cacheSvgColor === '#FFFFFF');
    this.$svgColor.classList.toggle('active', this.cacheSvgColor !== '#000000' && this.cacheSvgColor !== '#FFFFFF');
    this.$pngBlack.classList.toggle('active', this.cachePngColor === '#000000');
    this.$pngWhite.classList.toggle('active', this.cachePngColor === '#FFFFFF');
    this.$pngColor.classList.toggle('active', this.cachePngColor !== '#000000' && this.cachePngColor !== '#FFFFFF');
    this.$png24.classList.toggle('active', this.cachePngSize === '24');
    this.$png36.classList.toggle('active', this.cachePngSize === '36');
    this.$png48.classList.toggle('active', this.cachePngSize === '48');
    this.$png96.classList.toggle('active', this.cachePngSize === '96');
    this.$colorPicker.addEventListener('select', this.handleColorSelect.bind(this));
    this.$colorHexRgb.addEventListener('change', this.handleHexRgbChange.bind(this));
    this.syncEyedropper();
  }

  handleColorSelect(e) {
    switch(this.color) {
      case 'svg':
        this.cacheSvgColor = e.detail.hex;
        break;
      case 'png':
        this.cachePngColor = e.detail.hex;
        break;
    }
    this.$colorHexRgb.value = e.detail.hex;
    this.syncEyedropper();
  }

  handleHexRgbChange(e) {
    switch(this.color) {
      case 'svg':
        this.cacheSvgColor = e.detail.hex;
        break;
      case 'png':
        this.cachePngColor = e.detail.hex;
        break;
    }
    this.$colorPicker.value = e.detail.hex;
    this.syncEyedropper();
  }

  syncEyedropper() {
    if (this.cachePngColor !== '#000000' && this.cachePngColor !== '#FFFFFF') {
      this.$pngColor.style.color = this.cachePngColor;
    } else {
      this.$pngColor.style.color = 'transparent';
    }
    if (this.cacheSvgColor !== '#000000' && this.cacheSvgColor !== '#FFFFFF') {
      this.$svgColor.style.color = this.cacheSvgColor;
    } else {
      this.$svgColor.style.color = 'transparent';
    }
  }

  moveFocus(e: KeyboardEvent, index: number) {
    console.log(e.which, index);
    let newIndex;
    switch(e.which) {
      case 37:
        newIndex = index - 1;
        if (newIndex >= 0) {
          this.items[newIndex][0].focus();
          e.preventDefault();
        }
        break;
      case 38:
        newIndex = index - this.columns;
        if (newIndex >= 0) {
          this.items[newIndex][0].focus();
          e.preventDefault();
        }
        break;
      case 39:
        newIndex = index + 1;
        if (newIndex < this.icons.length) {
          this.items[newIndex][0].focus();
          e.preventDefault();
        }
        break;
      case 40:
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
    const gridRect = this.$grid.getBoundingClientRect();
    const cmRect = this.$contextMenu.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    if (y + gridRect.top + cmRect.height + 4 > window.innerHeight
      && x + gridRect.left + cmRect.width + 24 > window.innerWidth) {
      y = y - cmRect.height;
      x -= x + gridRect.left + cmRect.width + 24 - window.innerWidth;
     } else if (y + gridRect.top + cmRect.height + 4 > window.innerHeight) {
      y -= y + gridRect.top + cmRect.height + 4 - window.innerHeight;
    } else if (x + gridRect.left + cmRect.width + 24 > window.innerWidth) {
      x -= x + gridRect.left + cmRect.width + 24 - window.innerWidth;
    }
    this.currentIndex = index;
    var icon = this.icons[index];
    this.$newTab.href = `icons/${icon.name}`;
    this.$contextMenu.style.left = `${x}px`;
    this.$contextMenu.style.top = `${y}px`;
    this.$contextMenu.style.visibility = 'visible';
    this.hideTooltip();
    this.canOpenTooltip = false;
    const self = this;
    this.$contextMenu.addEventListener('mouseenter', () => {
      this.preventClose = true;
    });
    this.$contextMenu.addEventListener('mouseleave', () => {
      this.preventClose = false;
    });
    function handleMouseDown(e) {
      if (!self.preventClose) {
        self.hideContextMenu();
        document.removeEventListener('mousedown', handleMouseDown);
      }
    }
    this.preventClose = false;
    document.addEventListener('mousedown', handleMouseDown);
    this.$color.style.visibility = 'hidden';
  }

  hideContextMenu() {
    this.$contextMenu.style.visibility = 'hidden';
    this.$color.style.visibility = 'hidden';
    this.canOpenTooltip = true;
  }

  handleCopyIconName() {
    const icon = this.icons[this.currentIndex];
    copyText(icon.name);
    addInfoToast(`Copied "${icon.name}" to clipboard.`);
    this.hideContextMenu();
  }

  showTooltip(icon: any, index: number) {
    if (!this.canOpenTooltip) { return; }
    this.$tooltipText.innerText = icon.name;
    const { x, y } = this.getPositionFromIndex(index);
    const half = Math.ceil(this.columns / 2);
    let offsetX = 0;
    if (x >= half) {
      const { width } = this.$tooltip.getBoundingClientRect();
      offsetX -= width - 44;
    }
    //this.$tooltip.style.transform = `translate(${x * 44 + offsetX}px, ${(y * 44 + 5)}px`;
    //this.$tooltipArrow.style.transform = `translate(${16 + (-1 * offsetX)}px, 0)`;
    //this.$tooltip.classList.add('visible');
  }

  hideTooltip() {
    this.$tooltip.classList.remove('visible');
    this.index = -1;
  }

  getPositionFromIndex(index: number) {
    return {
      x: index % this.columns,
      y: Math.floor(index / this.columns)
    };
  }
}