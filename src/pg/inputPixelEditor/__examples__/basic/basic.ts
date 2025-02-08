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

  @Part() $reset: HTMLButtonElement;
  @Part() $clear: HTMLButtonElement;
  @Part() $modePixel: HTMLButtonElement;
  @Part() $modeLine: HTMLButtonElement;
  @Part() $modeRectangle: HTMLButtonElement;
  @Part() $modeRectangleOutline: HTMLButtonElement;
  @Part() $modeEllipse: HTMLButtonElement;
  @Part() $modeEllipseOutline: HTMLButtonElement;

  connectedCallback() {
    this.$width.value = '10';
    this.$height.value = '10';
    this.$size.value = '10';
    this.$input.addEventListener('change', this.handleChange.bind(this));
    this.$width.addEventListener('input', this.handleWidthChange.bind(this));
    this.$height.addEventListener('input', this.handleHeightChange.bind(this));
    this.$size.addEventListener('input', this.handleSizeChange.bind(this));
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
}