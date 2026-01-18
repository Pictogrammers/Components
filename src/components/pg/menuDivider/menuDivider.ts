import { Component, Prop, Part } from '@pictogrammers/element';

import template from './menuDivider.html';
import style from './menuDivider.css';

@Component({
  selector: 'pg-menu-divider',
  style,
  template
})
export default class PgMenuDivider extends HTMLElement {
  @Prop() focusable = false;

  @Part() $divider: HTMLDivElement;

  getHeight(): number {
    const computedStyle = window.getComputedStyle(this.$divider);
    const marginTop = parseFloat(computedStyle.marginTop);
    const marginBottom = parseFloat(computedStyle.marginBottom);
    return this.$divider.getBoundingClientRect().height + marginTop + marginBottom;
  }
}