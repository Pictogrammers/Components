import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeEditorNumber.html';
import style from './nodeEditorNumber.css';

@Component({
  selector: 'pg-node-editor-number',
  style,
  template,
})
export default class PgNodeEditorNumber extends HTMLElement {

  static type = 'Number';

  @Prop() label: string = '';
  @Prop() value: number = 0;
  @Prop() name: string = '';

  @Part() $label: HTMLLabelElement;
  @Part() $input: HTMLInputElement;

  connectedCallback() {
    this.$input.addEventListener('change', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: Number(this.$input.value),
        }
      }));
    });
    this.$input.addEventListener('input', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          value: Number(this.$input.value),
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.value) {
      this.$input.value = String(this.value);
    }
  }

  get height() {
    return 2;
  }
}
