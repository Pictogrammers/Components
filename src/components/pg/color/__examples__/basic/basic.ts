import { Component, Part, Prop } from '@pictogrammers/element';
import PgColor from '../../color';

import template from './basic.html';

@Component({
  selector: 'x-pg-color-basic',
  template
})
export default class XPgColorBasic extends HTMLElement {
  @Part() $color1: PgColor;
  @Part() $colorSelected: HTMLSpanElement;

  connectedCallback() {
    this.$color1.addEventListener('select', (e: CustomEvent) => {
      const { rgb, hex } = e.detail;
      this.$colorSelected.innerText = `${hex} or rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    });
  }
}