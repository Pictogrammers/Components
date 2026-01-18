import { Component, Prop, Part } from '@pictogrammers/element';

import template from './tab.html';
import style from './tab.css';

@Component({
  selector: 'pg-tab',
  style,
  template
})
export default class PgTab extends HTMLElement {

  @Prop() label: string = '';

  @Part() $tab: HTMLDivElement;

  connectedCallback() {

  }

  show() {
    this.$tab.classList.add('active');
  }

  hide() {
    this.$tab.classList.remove('active');
  }

  render(changes) {
    if (changes.label) {
      this.dispatchEvent(
        new CustomEvent('tab', {
          detail: {
            label: this.label
          },
          bubbles: true
        })
      );
    }
  }
}