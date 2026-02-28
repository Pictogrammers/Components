import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputRange.html';
import style from './inputRange.css';

@Component({
  selector: 'pg-input-range',
  style,
  template
})
export default class PgInputRange extends HTMLElement {
  @Prop() value: number = 0;
  @Prop() min: number = 0;
  @Prop() max: number = 100;
  @Prop() step: number = 1;
  @Prop() name: string = '';

  @Part() $input: HTMLInputElement;

  render(changes: any) {
    if (changes.min) {
      this.$input.min = `${this.min}`;
    }
    if (changes.max) {
      this.$input.max = `${this.max}`;
    }
    if (changes.step) {
      this.$input.step = `${this.step}`;
    }
    if (changes.value) {
      this.$input.value = `${this.value}`;
    }
    if (changes.name) {
      this.$input.name = this.name;
    }
  }

  connectedCallback() {
    this.$input.addEventListener('change', this.#handleChange.bind(this));
    this.$input.addEventListener('input', this.#handleInput.bind(this));
  }

  #handleChange(e: any) {
    const { value } = e.target;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value,
          name: this.name,
        }
      })
    );
  }

  #handleInput(e: any) {
    const { value } = e.target;
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          value,
          name: this.name,
        }
      })
    );
  }
}
