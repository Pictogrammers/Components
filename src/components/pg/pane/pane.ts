import { Component, Prop, normalizeFloat, normalizeString } from '@pictogrammers/element';

import template from './pane.html';
import style from './pane.css';

@Component({
  selector: 'pg-pane',
  style,
  template
})
export default class PgPane extends HTMLElement {

  @Prop(normalizeString) label: string = '';
  @Prop(normalizeFloat) minSize: number = 0;
  @Prop(normalizeFloat) defaultSize: number = 0;
  @Prop(normalizeFloat) size: number = 0;

  #lastSize: number = 0;

  render(changes: any) {
    if (changes.size || changes.defaultSize || changes.minSize) {
      const effectiveSize = this.size > 0 ? this.size : this.defaultSize;

      this.classList.toggle('fixed', effectiveSize > 0);
      if (effectiveSize > 0) {
        this.style.setProperty('--pg-pane-size', `${effectiveSize}rem`);
      } else {
        this.style.removeProperty('--pg-pane-size');
      }

      if (this.minSize > 0) {
        this.style.setProperty('--pg-pane-min-size', `${this.minSize}rem`);
      } else {
        this.style.removeProperty('--pg-pane-min-size');
      }

      if (effectiveSize !== this.#lastSize) {
        this.#lastSize = effectiveSize;
        this.dispatchEvent(new CustomEvent('resize', {
          detail: { size: effectiveSize },
          bubbles: true
        }));
      }
    }
  }
}
