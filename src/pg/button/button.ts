import { Component, Part, Prop } from '@pictogrammers/element';

import template from './button.html';
import style from './button.css';

@Component({
  selector: 'pg-button',
  style,
  template
})
export default class PgButton extends HTMLElement {
  @Prop() active: string | boolean = false;
  @Prop() block: string | boolean = false;
  @Prop() start: string | boolean = false;
  @Prop() center: string | boolean = false;
  @Prop() end: string | boolean = false;

  @Part() $button: HTMLButtonElement;

  connectedCallback() {
    this.$button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('click'));
    });
  }

  render(changes) {
    const t = [true, 'true', ''];
    if (changes.active) {
      this.$button.classList.toggle('active', t.includes(this.active));
    }
    if (changes.start) {
      this.$button.classList.toggle('start', t.includes(this.start));
    }
    if (changes.end) {
      this.$button.classList.toggle('end', t.includes(this.end));
    }
    if (changes.center) {
      this.$button.classList.toggle('center', t.includes(this.center));
    }
    if (changes.block) {
      this.$button.classList.toggle('block', t.includes(this.block));
    }
  }
}