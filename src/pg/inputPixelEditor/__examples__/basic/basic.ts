import { Component, Part } from '@pictogrammers/element';
import PgInputPixelEditor from '../../inputPixelEditor';
import { maskToBitmap } from '../../utils/maskToBitmap';

import template from './basic.html';
import style from './basic.css';

@Component({
  selector: 'x-pg-input-pixel-editor-basic',
  style,
  template
})
export default class XPgInputPixelEditorBasic extends HTMLElement {

  @Part() $input: PgInputPixelEditor;
  @Part() $value1: HTMLSpanElement;
  @Part() $value2: HTMLSpanElement;
  @Part() $debug: HTMLDivElement;
  @Part() $width: HTMLInputElement;
  @Part() $height: HTMLInputElement;
  @Part() $size: HTMLInputElement;
  @Part() $transparent: HTMLInputElement;

  @Part() $reset: HTMLButtonElement;
  @Part() $clear: HTMLButtonElement;
  @Part() $invert: HTMLButtonElement;
  @Part() $modePixel: HTMLButtonElement;
  @Part() $modeLine: HTMLButtonElement;
  @Part() $modeRectangle: HTMLButtonElement;
  @Part() $modeRectangleOutline: HTMLButtonElement;
  @Part() $modeEllipse: HTMLButtonElement;
  @Part() $modeEllipseOutline: HTMLButtonElement;

  @Part() $save: HTMLButtonElement;
  @Part() $open: HTMLButtonElement;
  @Part() $output: HTMLPreElement;
  @Part() $file: HTMLInputElement;
  @Part() $saveSvg: HTMLInputElement;
  @Part() $savePng: HTMLInputElement;

  // MAKE A LIST COMPONENT!!!! [text | delete]
  @Part() $colors: HTMLPreElement;
  @Part() $layers: HTMLPreElement;

  connectedCallback() {
    this.$width.value = '10';
    this.$height.value = '10';
    this.$size.value = '10';
    this.$input.addEventListener('change', this.handleChange.bind(this));
    this.$width.addEventListener('input', this.handleWidthChange.bind(this));
    this.$height.addEventListener('input', this.handleHeightChange.bind(this));
    this.$size.addEventListener('input', this.handleSizeChange.bind(this));
    this.$transparent.addEventListener('input', this.handleTransparentChange.bind(this));
    this.$input.addEventListener('input', this.handleInput.bind(this));
    this.$input.addEventListener('debug', this.handleDebug.bind(this));
    this.$modePixel.addEventListener('click', () => {
      this.$input.inputModePixel();
    });
    this.$modeLine.addEventListener('click', () => {
      this.$input.inputModeLine();
    });
    this.$modeRectangle.addEventListener('click', () => {
      this.$input.inputModeRectangle();
    });
    this.$modeRectangleOutline.addEventListener('click', () => {
      this.$input.inputModeRectangleOutline();
    });
    this.$modeEllipse.addEventListener('click', () => {
      this.$input.inputModeEllipse();
    });
    this.$modeEllipseOutline.addEventListener('click', () => {
      this.$input.inputModeEllipseOutline();
    });
    this.$reset.addEventListener('click', () => {
      this.$input.reset();
    });
    this.$clear.addEventListener('click', () => {
      this.$input.clear();
    });
    this.$invert.addEventListener('click', () => {
      this.$input.invert();
    });
    this.$save.addEventListener('click', async () => {
      const json = await this.$input.save();
      this.$output.textContent = JSON.stringify(json, null, 4);
    });
    this.$open.addEventListener('click', () => {
      const json = JSON.parse(this.$output.textContent || '');
      this.$input.open(json as any);
    });
    this.$file.addEventListener('change', this.handleFile.bind(this));
    this.$saveSvg.addEventListener('click', async () => {
      // @ts-ignore
      const handle = await window.showSaveFilePicker({
        suggestedName: 'Canvas',
        types: [{
          description: 'SVG Document',
          accept: {'image/svg+xml': ['.svg']},
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.$width.value} ${this.$height.value}">`);
      await writable.write(`<path d="${'test'}" />`);
      await writable.write('</svg>');
      await writable.close();
    });
    this.$savePng.addEventListener('click', async () => {
      // @ts-ignore
      const handle = await window.showSaveFilePicker({
        suggestedName: 'CanvasName',
        types: [{
          description: 'SVG Document',
          accept: {'image/svg+xml': ['.svg']},
        }],
      });
      const writable = await handle.createWritable();
      await writable.write('something');
      await writable.write
      await writable.close();
    });
  }

  handleFile(e) {
    const { files } = e.currentTarget;
    if (files.length !== 1) {
      throw new Error('select only 1 file');
    }
    switch(files[0].type) {
      case 'image/svg+xml':
        // Read the file
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          const size = content.match(/viewBox="\d+ \d+ (\d+) (\d+)"/) as string[];
          const width = parseInt(size[1], 10);
          const height = parseInt(size[2], 10);
          const path = (content.match(/d="([^"]+)"/) as string[])[1];
          // Render path
          console.log(path, size[1], size[2]);
          this.$input.applyTemplate(maskToBitmap(path, width, height));
          ;
        };
        reader.onerror = () => {
          throw new Error("Error reading the file. Please try again.");
        };
        reader.readAsText(files[0]);
        break;
      default:
        throw new Error('Unsupported format.');
    }
  }

  handleChange(e: CustomEvent) {
    const { value } = e.detail;
    this.$value1.textContent = value.join('--');
  }

  handleInput(e: CustomEvent) {
    const { value } = e.detail;
    this.$value2.textContent = value;
  }

  handleDebug(e: CustomEvent) {
    const { x, y, width, height, context, baseLayer, editLayer, noEditLayer, previewLayer } = e.detail;
    this.$debug.appendChild(baseLayer);
    this.$debug.appendChild(editLayer);
    this.$debug.appendChild(noEditLayer);
    this.$debug.appendChild(previewLayer);
    //context.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    //context.lineWidth = 1;
    //context.strokeRect(x, y, width, height);
  }

  handleWidthChange(e) {
    this.$input.width = e.target.value;
    this.$debug.innerHTML = '';
  }

  handleHeightChange(e) {
    this.$input.height = e.target.value;
    this.$debug.innerHTML = '';
  }

  handleSizeChange(e) {
    this.$input.size = e.target.value;
    this.$debug.innerHTML = '';
  }

  handleTransparentChange(e) {
    this.$input.transparent = e.target.checked;
  }
}