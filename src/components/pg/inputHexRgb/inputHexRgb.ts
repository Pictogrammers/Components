import { Component, Prop, Part } from '@pictogrammers/element';
import { normalizeHex, hexToRgb, rgbToHex } from './utils';

import template from './inputHexRgb.html';
import style from './inputHexRgb.css';

@Component({
  selector: 'pg-input-hex-rgb',
  style,
  template
})
export default class PgInputHexRgb extends HTMLElement {
  @Prop() value: string = '#000000';

  @Part() $hex: HTMLInputElement;
  @Part() $red: HTMLInputElement;
  @Part() $green: HTMLInputElement;
  @Part() $blue: HTMLInputElement;

  connectedCallback() {
    this.$hex.value = this.value;
    this.updateRgb();
    this.$hex.addEventListener('input', this.updateRgbDispatch.bind(this));
    this.$red.addEventListener('input', this.updateHexDispatch.bind(this));
    this.$green.addEventListener('input', this.updateHexDispatch.bind(this));
    this.$blue.addEventListener('input', this.updateHexDispatch.bind(this));
  }

  updateRgb() {
    const hex = normalizeHex(this.$hex.value);
    const rgb = hexToRgb(hex);
    if (rgb !== null) {
      this.$red.value = rgb.r.toString();
      this.$green.value = rgb.g.toString();
      this.$blue.value = rgb.b.toString();
    }
  }

  updateRgbDispatch() {
    this.updateRgb();
    this.dispatchSelect();
  }

  updateHexDispatch() {
    this.$hex.value = rgbToHex(
      parseInt(this.$red.value || '0', 10),
      parseInt(this.$green.value || '0', 10),
      parseInt(this.$blue.value || '0', 10)
    );
    this.dispatchSelect();
  }

  dispatchSelect() {
    const hex = normalizeHex(this.$hex.value);
    const rgb = rgbToHex(
      parseInt(this.$red.value || '0', 10),
      parseInt(this.$green.value || '0'),
      parseInt(this.$blue.value || '0')
    );
    this.value = hex;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          hex,
          rgb
        }
      })
    );
  }

  render() {
    const hex = normalizeHex(this.value);
    const rgb = hexToRgb(hex);
    this.$hex.value = hex;
    this.$red.value = `${rgb ? rgb.r : 0}`;
    this.$green.value = `${rgb ? rgb.g : 0}`;
    this.$blue.value = `${rgb ? rgb.b : 0}`;
  }
}