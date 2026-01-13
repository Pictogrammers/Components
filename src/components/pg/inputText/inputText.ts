import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputText.html';
import style from './inputText.css';

@Component({
  selector: 'pg-input-text',
  style,
  template
})
export default class PgInputText extends HTMLElement {
  @Prop() name: string = '';
  @Prop() value: string = '';
  @Prop() placeholder: string = '';
  @Prop() readOnly: boolean = false;

  @Part() $input: HTMLInputElement;

  connectedCallback() {
    this.$input.addEventListener('input', this.handleInput.bind(this));
    this.$input.addEventListener('change', this.handleChange.bind(this));
  }

  skipValue = false;

  render(changes) {
    if (changes.value && !this.skipValue) {
      this.$input.value = this.value;
    }
    if (changes.placeholder) {
      this.$input.placeholder = this.placeholder;
    }
    if (changes.readOnly) {
      this.$input.readOnly = this.readOnly;
    }
    this.skipValue = false;
  }

  handleInput(e) {
    e.stopPropagation();
    this.skipValue = true;
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          value: e.target.value,
          name: e.name
        }
      })
    );
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
