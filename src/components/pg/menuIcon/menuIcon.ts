import { Component, Prop, Part, Local } from '@pictogrammers/element';

import template from './menuIcon.html';
import style from './menuIcon.css'
import { copyText, getCopySvgInline } from '../shared/copy';
import { addInfoToast } from '../shared/toast';
import { Icon } from '../shared/models/icon';

@Component({
  selector: 'pg-menu-icon',
  style,
  template
})
export default class PgMenuIcon extends HTMLElement {
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

  @Part() $color: any;
  @Part() $colorPicker: any;
  @Part() $colorHexRgb: any;

  @Local('store') store = new Map<string, any>([
    ['cachePngColor', '#000000'],
    ['cachePngSize', 24],
    ['cacheSvgColor', '#000000']
  ]);

  color = 'svg';
  @Prop() currentIndex: number = 0;
  @Prop() icon: Icon = new Icon();

  connectedCallback() {
    // Wire Up Context Menu
    this.$copyIconName.addEventListener('click', this.handleCopyIconName.bind(this));
    this.$svgBlack.addEventListener('click', () => {
      this.store.set('cacheSvgColor', '#000000');
      this.render();
    });
    this.$svgWhite.addEventListener('click', () => {
      this.store.set('cacheSvgColor', '#FFFFFF');
      this.render();
    });
    let preventSvgColor = false;
    this.$svgColor.addEventListener('click', () => {
      if (preventSvgColor) { preventSvgColor = false; return; }
      this.color = 'svg';
      this.$colorPicker.value = this.store.get('cacheSvgColor');
      this.$colorHexRgb.value = this.store.get('cacheSvgColor');
      const self = this;
      //createPopper(this.$svgColor, this.$color, {
      //  placement: 'bottom-start'
      //});
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
      this.store.set('cachePngColor', '#000000');
      this.render();
    });
    this.$pngWhite.addEventListener('click', () => {
      this.store.set('cachePngColor', '#FFFFFF');
      this.render();
    });
    let preventPngColor = false;
    this.$pngColor.addEventListener('click', () => {
      if (preventPngColor) { preventPngColor = false; return; }
      this.color = 'png';
      this.$colorPicker.value = this.store.get('cachePngColor');
      this.$colorHexRgb.value = this.store.get('cachePngColor');
      const self = this;
      //createPopper(this.$pngColor, this.$color, {
      //  placement: 'bottom-start'
      //});
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
      this.store.set('cachePngSize', 24);
      this.render();
    });
    this.$png36.addEventListener('click', () => {
      this.store.set('cachePngSize', 36);
      this.render();
    });
    this.$png48.addEventListener('click', () => {
      this.store.set('cachePngSize', 48);
      this.render();
    });
    this.$png96.addEventListener('click', () => {
      this.store.set('cachePngSize', 96);
      this.render();
    });
    this.$svgDownload.addEventListener('click', () => {
      alert(`SVG ${this.store.get('cacheSvgColor')}`);
    });
    this.$pngDownload.addEventListener('click', () => {
      alert(`SVG ${this.store.get('cachePngSize')} ${this.store.get('cachePngColor')}`);
    });
    this.$copySvgInline.addEventListener('click', () => {
      const icon = this.icon;
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

  handleCopyIconName() {
    const icon = this.icon;
    if (icon && icon.name) {
      copyText(icon.name);
      addInfoToast(`Copied "${icon.name}" to clipboard.`);
    }
    this.hideContextMenu();
  }

  hideContextMenu() {

  }

  showContextMenu(index: number, x: number, y: number) {
    this.dispatchEvent(new CustomEvent('closemenu'));
    /*const gridRect = this.$grid.getBoundingClientRect();
    const cmRect = this.$contextMenu.getBoundingClientRect();
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
    this.$color.style.visibility = 'hidden';*/
  }

  render() {
    // Context Menu
    const cacheSvgColor = this.store.get('cacheSvgColor');
    const cachePngColor = this.store.get('cachePngColor');
    const cachePngSize = this.store.get('cachePngSize');
    this.$svgBlack.classList.toggle('active', cacheSvgColor === '#000000');
    this.$svgWhite.classList.toggle('active', cacheSvgColor === '#FFFFFF');
    this.$svgColor.classList.toggle('active', cacheSvgColor !== '#000000' && cacheSvgColor !== '#FFFFFF');
    this.$pngBlack.classList.toggle('active', cachePngColor === '#000000');
    this.$pngWhite.classList.toggle('active', cachePngColor === '#FFFFFF');
    this.$pngColor.classList.toggle('active', cachePngColor !== '#000000' && cachePngColor !== '#FFFFFF');
    this.$png24.classList.toggle('active', cachePngSize === 24);
    this.$png36.classList.toggle('active', cachePngSize === 36);
    this.$png48.classList.toggle('active', cachePngSize === 48);
    this.$png96.classList.toggle('active', cachePngSize === 96);
    this.$colorPicker.addEventListener('select', this.handleColorSelect.bind(this));
    this.$colorHexRgb.addEventListener('change', this.handleHexRgbChange.bind(this));
    this.syncEyedropper();
  }

  handleColorSelect(e) {
    switch(this.color) {
      case 'svg':
        this.store.set('cacheSvgColor', e.detail.hex);
        break;
      case 'png':
        this.store.set('cachePngColor', e.detail.hex);
        break;
    }
    this.$colorHexRgb.value = e.detail.hex;
    this.syncEyedropper();
  }

  handleHexRgbChange(e) {
    switch(this.color) {
      case 'svg':
        this.store.set('cacheSvgColor', e.detail.hex);
        break;
      case 'png':
        this.store.set('cachePngColor', e.detail.hex);
        break;
    }
    this.$colorPicker.value = e.detail.hex;
    this.syncEyedropper();
  }

  syncEyedropper() {
    const cachePngColor = this.store.get('cachePngColor');
    if (cachePngColor !== '#000000' && cachePngColor !== '#FFFFFF') {
      this.$pngColor.style.color = cachePngColor;
    } else {
      this.$pngColor.style.color = 'transparent';
    }
    const cacheSvgColor = this.store.get('cacheSvgColor');
    if (cacheSvgColor !== '#000000' && cacheSvgColor !== '#FFFFFF') {
      this.$svgColor.style.color = cacheSvgColor;
    } else {
      this.$svgColor.style.color = 'transparent';
    }
  }

}