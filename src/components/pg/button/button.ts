import { Component, Part, Prop, normalizeBoolean, normalizeString } from '@pictogrammers/element';

import template from './button.html';
import style from './button.css';

const variants = ['neutral', 'brand'];

@Component({
  selector: 'pg-button',
  style,
  template
})
export default class PgButton extends HTMLElement {
  @Prop(normalizeString) variant: string = 'neutral';
  @Prop(normalizeBoolean) active: boolean = false;
  @Prop(normalizeBoolean) block: boolean = false;
  @Prop(normalizeBoolean) start: boolean = false;
  @Prop(normalizeBoolean) center: boolean = false;
  @Prop(normalizeBoolean) end: boolean = false;

  @Part() $button: HTMLButtonElement;
  @Part() $number: HTMLSpanElement;
  @Part() $bar: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('click'));
    });
  }

  render(changes) {
    if (changes.variant) {
      if (!variants.includes(this.variant)) {
        throw new Error(`invalid variant ${this.variant}`);
      }
      this.$button.classList.toggle('neutral', this.variant === 'neutral');
      this.$button.classList.toggle('brand', this.variant === 'brand');
    }
    if (changes.active) {
      this.$button.classList.toggle('active', this.active);
    }
    if (changes.start) {
      this.$button.classList.toggle('start', this.start);
    }
    if (changes.end) {
      this.$button.classList.toggle('end', this.end);
    }
    if (changes.center) {
      this.$button.classList.toggle('center', this.center);
    }
    if (changes.block) {
      this.$button.classList.toggle('block', this.block);
    }
  }

  getBoundingClientRect(): DOMRect {
    return this.$button.getBoundingClientRect();
  }
}