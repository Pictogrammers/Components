import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputSelect.html';
import style from './inputSelect.css';

interface InputSelectItem {
  label: string;
  value: string;
}

@Component({
  selector: 'pg-input-select',
  style,
  template
})
export default class PgInputSelect extends HTMLElement {
  @Prop() options: InputSelectItem[] = [];
  @Prop() value: string;
  @Prop() name: string = '';

  @Part() $select: HTMLSelectElement;

  render(changes) {
    if (changes.options) {
      this.options.forEach(o => {
        const option = document.createElement('option');
        option.innerText = o.label;
        option.value = o.value;
        this.$select.appendChild(option);
      });
      if (this.$select.value !== this.value) {
        this.$select.value = this.value;
      }
    }
    if (changes.value) {
      if (this.$select.value !== this.value) {
        this.$select.value = this.value;
      }
    }
  }

  connectedCallback() {
    this.$select.addEventListener('change', this.handleSelect.bind(this));
  }

  handleSelect(e) {
    const { value } = e.target;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value,
          name: this.name
        }
      })
    )
  }
}