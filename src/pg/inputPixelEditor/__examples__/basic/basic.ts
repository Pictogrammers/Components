import { Component, Part } from '@pictogrammers/element';
import PgInputPixelEditor from '../../inputPixelEditor';

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
      const json = this.$output.textContent;
      this.$input.open(json as any);
    });
  }

  handleChange(e: CustomEvent) {
    const { value } = e.detail;
    this.$value1.innerText = value;
  }

  handleInput(e: CustomEvent) {
    const { value } = e.detail;
    this.$value2.innerText = value;
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