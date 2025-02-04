import { Component, Part } from '@pictogrammers/element';
import PgInputPixelEditor from '../../inputPixelEditor';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-pixel-editor-basic',
  template
})
export default class XPgInputPixelEditorBasic extends HTMLElement {

  @Part() $input: PgInputPixelEditor;
  @Part() $value1: HTMLSpanElement;
  @Part() $value2: HTMLSpanElement;
  @Part() $debug: HTMLDivElement;

  @Part() $modePixel: HTMLButtonElement;
  @Part() $modeLine: HTMLButtonElement;
  @Part() $modeRectangle: HTMLButtonElement;
  @Part() $modeRectangleOutline: HTMLButtonElement;
  @Part() $modeEllipse: HTMLButtonElement;
  @Part() $modeEllipseOutline: HTMLButtonElement;

  connectedCallback() {
    this.$input.addEventListener('change', this.handleChange.bind(this));
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
    const { baseLayer, editLayer, previewLayer } = e.detail;
    this.$debug.appendChild(baseLayer);
    this.$debug.appendChild(editLayer);
    this.$debug.appendChild(previewLayer);
  }
}