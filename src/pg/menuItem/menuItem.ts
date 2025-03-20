import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './menuItem.html';
import style from './menuItem.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-menu-item',
  style,
  template
})
export default class PgMenuItem extends HTMLElement {
  @Prop() index: number;
  @Prop() label: string = '';

  @Part() $label: HTMLDivElement;

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
  }

  connectedCallback() {
    this.$label.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('select', {
        detail: { index: this.index }
      }));
    })
  }

  focus() {
    this.$label.focus();
  }

}