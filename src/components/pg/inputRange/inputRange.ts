import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputRange.html';
import style from './inputRange.css';

@Component({
  selector: 'pg-input-range',
  style,
  template
})
export default class PgInputRange extends HTMLElement {
  @Prop() min: string = '0';
  @Prop() max: string = '100';
  @Prop() step: string = '1';
  @Prop() name: string = '';

  @Part() $input: HTMLInputElement;

  render() {
    this.$input.min = this.min;
    this.$input.max = this.max;
    this.$input.step = this.step;
  }

  connectedCallback() {
    this.$input.addEventListener('change', this.#handleChange.bind(this));
    this.$input.addEventListener('input', this.#handleInput.bind(this));
  }

  #handleChange(e: any) {
    e.stopPropagation();
    const { value } = e.target;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value,
          name: this.name
        }
      })
    );
  }

  #handleInput(e: any) {
    e.stopPropagation();
    const { value } = e.target;
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          value,
          name: this.name
        }
      })
    );
  }
}