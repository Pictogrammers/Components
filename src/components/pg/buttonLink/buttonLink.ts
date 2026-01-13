import { Component, Part, Prop } from '@pictogrammers/element';

import template from './buttonLink.html';
import style from './buttonLink.css';

@Component({
  selector: 'pg-button-link',
  style,
  template
})
export default class PgButtonLink extends HTMLElement {
  @Prop() href: string = '';
  @Prop() active: string | boolean = false;
  @Prop() block: string | boolean = false;
  @Prop() start: string | boolean = false;
  @Prop() center: string | boolean = false;
  @Prop() end: string | boolean = false;

  @Part() $button: HTMLAnchorElement;

  connectedCallback() {
    this.$button.addEventListener('click', (e) => this.dispatchEvent(new CustomEvent('click')));
  }

  render(changes) {
    if (changes.href) {
      this.$button.href = this.href;
    }
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