import { Component, Prop, Part, normalizeFloat } from '@pictogrammers/element';

import template from './inputNumber.html';
import style from './inputNumber.css';
import PgButtonIncrement from '../buttonIncrement/buttonIncrement';

@Component({
  selector: 'pg-input-number',
  style,
  template,
})
export default class PgInputNumber extends HTMLElement {
  @Prop() name: string = '';
  @Prop(normalizeFloat) value: number = 0;
  @Prop(normalizeFloat) min: number = 0;
  @Prop(normalizeFloat) max: number = 100;
  @Prop(normalizeFloat) step: number = 1;
  @Prop() placeholder: string = '';
  @Prop() readOnly: boolean = false;
  @Prop() disableButtons: boolean = false;

  @Part() $input: HTMLInputElement;
  @Part() $buttonMinus: PgButtonIncrement;
  @Part() $buttonPlus: PgButtonIncrement;

  connectedCallback() {
    this.$input.addEventListener('input', this.handleInput.bind(this));
    this.$input.addEventListener('change', this.handleChange.bind(this));
    this.$buttonMinus.addEventListener('increment', (e: any) => {
      this.#triggerInput(this.value - this.step);
    });
    this.$buttonPlus.addEventListener('increment', (e: any) => {
      this.#triggerInput(this.value + this.step);
    });
    this.$buttonMinus.addEventListener('finish', (e: any) => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.value,
        },
      }));
    });
    this.$buttonPlus.addEventListener('finish', (e: any) => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.value,
        },
      }));
    });
  }

  skipValue = false;

  render(changes) {
    if (changes.value && !this.skipValue) {
      this.$input.value = `${this.value}`;
    }
    if (changes.placeholder) {
      this.$input.placeholder = this.placeholder;
    }
    if (changes.readOnly) {
      this.$input.readOnly = this.readOnly;
    }
    this.skipValue = false;
  }

  #triggerInput(value) {
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          value: value,
          name: this.name,
        }
      })
    );
  }

  handleInput(e) {
    e.stopPropagation();
    this.skipValue = true;
    const value = parseInt(e.target.value ?? '0', 10);
    this.#triggerInput(value);
  }

  handleChange(e) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: e.target.value,
          name: e.name
        }
      })
    );
  }
}
