import { Component, Prop, Part, forEach } from '@pictogrammers/element';

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
  @Prop() value: string = '';
  @Prop() name: string = '';

  @Part() $select: HTMLSelectElement;

  //cacheKeys: string[] = [];

  render(changes) {
    /*if (changes.options) {
      this.options.forEach((o) => {
        const option = document.createElement('option');
        option.textContent = o.label;
        option.value = o.value;
        this.$select.appendChild(option);
      });
      if (this.$select.value !== this.value) {
        this.$select.value = this.value;
      }
    }*/
    if (changes.value) {
      if (this.$select.value !== this.value) {
        this.$select.value = this.value;
      }
    }
  }

  connectedCallback() {
    forEach({
      container: this.$select,
      items: this.options,
      type: () => {
        return HTMLOptionElement;
      }
    })
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